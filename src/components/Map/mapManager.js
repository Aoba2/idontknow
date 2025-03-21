import L from 'leaflet'
import eventBus from '@/utils/eventBus'
import { getDetailsByCoordinates } from '@/services/dataStateCitiesTotalizers'

const DEFAULTS = {
  name: 'map',
  mapOptions: {
    zoomControl: false,
    doubleClickZoom: false
  },
  center: [-15.235, -51.9253],
  zoom: 4.4,
  position: 'topright',
  minZoom: 4,
  maxZoom: 17
}

export default class MapManager {
  _map = null
  _layerControl = null
  _layers = null
  _zoomControl = null

  constructor() {
    this._init()
  }

  /* PRIVATE METHODS */

  async _init() {
    this._map = L.map(DEFAULTS.name, DEFAULTS.mapOptions)
    this._setBaseMapView()

    this._addLayerControl()

    this._map.on('click', this._handleCarZoomOnClick.bind(this))
  }

  _setBaseMapView() {
    this._map.setView(DEFAULTS.center, DEFAULTS.zoom)
  }

  _addLayerControl() {
    this._zoomControl = L.control.zoom({ position: DEFAULTS.position }).addTo(this._map)
    this._layerControl = L.control.layers(null, null).addTo(this._map)
  }

  async _addBaseLayers(data) {
    if(!data) return

    data.baseMap.forEach((layer) => {
      const tileLayer = L.tileLayer(layer.url, {
        attribution: `© ${layer.name}`,
        minZoom: layer.minZoom || DEFAULTS.minZoom,
        maxZoom: layer.maxZoom || DEFAULTS.maxZoom
      })

      if (layer.default) {
        tileLayer.addTo(this._map)
      }
      this._layerControl.addBaseLayer(tileLayer, layer.name)
    })
  }

  async _addCarLayers(data) {
    if(!data) return

    this._layers = data
  }

  _convertBboxToPolygon(bbox) {
    const polygon = bbox
      .match(/POLYGON\(\((.*?)\)\)/)[1]
      .split(',')
      .map((coord) => {
        const [lng, lat] = coord.trim().split(' ').map(Number)
        return [lat, lng]
      })

    return L.polygon(polygon)
  }

  async _handleCarZoomOnClick(event) {
    const RURAL_ASSETS_LAYERS = {
      "ird_ir": "Imóveis Rurais",
      "ird_irara": "Imóveis Rurais de Assentamento da Reforma Agrária",
      "ird_ttpct": "Território Tradicional de Povos e Comunidades Tradicionais"
    }

    const ZOOM_TO_ALLOW_CLICK = 8

    const isRuralAssetsLayersActivated = !!this._layerControl._layers.filter((layer) => {
      return RURAL_ASSETS_LAYERS[layer.name]
    }).length

    const isClickAllowed = this._map.getZoom() >= ZOOM_TO_ALLOW_CLICK

    if(!isRuralAssetsLayersActivated || !isClickAllowed) return

    const coordinates = event.latlng

    const response = await getDetailsByCoordinates(coordinates)

    if (!response.data) return

    const { data } = response

    eventBus.clickedCAR = data

    this.handleFilterZoom(data)
  }

  /* GETTERS */

  get map() {
    return this._map
  }

  get layerControl() {
    return this._layerControl
  }

  get layers() {
    return this._layers
  }

  /* PUBLIC METHODS */

  async buildMap({ baseData, carData }) {
    await this._addBaseLayers(baseData)
    await this._addCarLayers(carData)
  }

  handleFilterZoom(entity) {

    if (entity.cities) {
      const layers = entity.cities.map((city) => {
        return this._convertBboxToPolygon(city.bounderBox)
      })

      const group = L.featureGroup(layers)
      this._map.fitBounds(group.getBounds())
      return

    }
    
    const layer = this._convertBboxToPolygon(entity.bounderBox)
    this._map.fitBounds(layer.getBounds())

    if(entity.codeProperty){
      const filterCod = [{ typeFilter: 'cod_imovel', valueFilter: entity.codeProperty }];
      this.reloadActiveLayers(filterCod);
      this.addCqlFilterByRestrictedArea({ entity });
      eventBus.$emit('updateFilters', filterCod);
    }
    
  }

  reloadActiveLayers(filters) {
    if(!filters) return

    const controlLayers = this._layerControl._layers
    const layerOptions = controlLayers.filter(cLayer => cLayer.layer.options?.options)

    layerOptions.forEach((cLayer) => {
      let cqlFilters = ''
      const childLayerOptions = cLayer.layer.options?.options

      const hasOptions = !!Object.keys(childLayerOptions).length

      if (hasOptions) {
        filters.forEach((filter) => {
          const foundFilter = childLayerOptions.find((item) => item.filter === filter.typeFilter)
          
          if (foundFilter) {
            if(cqlFilters) { cqlFilters += ' OR ' }

            cqlFilters += `${foundFilter.keyGeoserver} IN ('${filter.valueFilter}')`
          }
        })

        if(cqlFilters) {
          cLayer.layer.setParams({ CQL_FILTER: cqlFilters })
        }
      }
    })
  }

  reloadUf(filter) {
    if(!filter) return

    const controlLayers = this._layerControl._layers
    const targetLayer = controlLayers.find(cLayer => cLayer.name && cLayer.name === 'dt_estado');
    
    let cqlFilters = '';
  
    if (targetLayer) {
      const targetLayersOptions = targetLayer.layer.options.options;
      const foundFilter = targetLayersOptions.find((item) => item.filter === filter.typeFilter);
      
      if (foundFilter) {
        cqlFilters += `${foundFilter.keyGeoserver} IN ('${filter.valueFilter}')`
      }

      targetLayer.layer.setParams({ CQL_FILTER: cqlFilters })
    }
  }

  addCqlFilterByRestrictedArea(entity) { 
    const KEYS_RESTRICTED_AREAS = {
      'ar_ti': 'Terras Indígenas',
      'ar_uc': 'Unidades de Conservação',
      'ar_emb': 'Embargos',
    }

    let cqlFilters = '';
    
    const controlLayers = this.layerControl._layers
    const targetLayers = controlLayers.filter(cLayer => KEYS_RESTRICTED_AREAS[cLayer.name]);
    if(!targetLayers.length) return

    if(entity.car) {
      targetLayers.forEach((tLayer) => {
        const newLayer = tLayer.layer.options.options[0].layer
        tLayer.layer.setParams({ layers: newLayer, viewParams: `cod:${entity.car.codeProperty}` })
      })
  
      return
    }

    if(entity.entity.codeProperty) {
      targetLayers.forEach((tLayer) => {
        const newLayer = tLayer.layer.options.options[0].layer
        tLayer.layer.setParams({ layers: newLayer, viewParams: `cod:${entity.entity.codeProperty}` })
      })
  
      return
    }

    if(entity.uf) {
      cqlFilters += `uf='${entity.uf.id}'`

      if(entity.cities) {
        const citiesIn = `IN ('${entity.cities.map((city) => city.name).join(',')}')`

        cqlFilters += ` AND municipio ${citiesIn}`
     
      }
      
      targetLayers.forEach((tLayer) => tLayer.layer.setParams({ CQL_FILTER: cqlFilters }))
    }
    
  } 

}

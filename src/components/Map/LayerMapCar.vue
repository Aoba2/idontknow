<template>
  <el-menu-item :index="getIndexElMenu">
    <template #title>
      <div class="conteiner">
        <div class="title">
          <span 
              class="cor-legenda" 
              :style="{ borderColor: layer.style?.fillColor, backgroundColor: layer.style?.color }"
            />
          <p>{{ layer.name }}</p>
        </div>
        <span class="switch-component">
          <el-switch v-model="localLayerVisible" @change="toggleVisible">
            <template #active-action>
              <i :style="{ fontSize: '10px', color: '#42916E', }" class="fa-solid fa-check"></i>
            </template>
            <template #inactive-action>
              <i :style="{ fontSize: '10px' }" class="fa-solid fa-xmark"></i>
            </template>
          </el-switch>
          <p> {{localLayerVisible ? 'Ativo' : 'Desligado' }} </p>
        </span>
      </div>
    </template>
  </el-menu-item>
  <el-divider/>
</template>

<script setup>
import eventBus from '@/utils/eventBus';
import L from "leaflet";
import { inject, onMounted, ref, watch } from 'vue';

const KEYS_RESTRICTED_AREAS = {
  'ar_ti': 'Terras Indígenas',
  'ar_uc': 'Unidades de Conservação',
  'ar_emb': 'Embargos',
}

const layerConverted = ref({})
const map = inject('mapProvide');
const layerControl = inject('layerControl');
const filters = inject('filters');
const mapFilters = inject('mapFilters');

const emit = defineEmits(['updateVisibleAllSwitch'])

const props = defineProps({
  visibleAll: {
    type: Boolean,
    required: true
  },
  layer: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
  }
});

const localLayerVisible = ref(props.layer.visible);

onMounted(async () => {

  layerConverted.value = convertToWms(props.layer)

  localLayerVisible.value = props.layer.activeDefault

  toggleVisible()
});

function toggleVisible () {
  emit('updateVisibleAllSwitch', localLayerVisible.value, props.layer.key )
  if (localLayerVisible.value) {
    if (!map.value.hasLayer(layerConverted.value)){
      if(KEYS_RESTRICTED_AREAS[layerConverted.value.options.key]){
        addCqlFilterByRestrictedArea(mapFilters.value)
      }
      else {
        checkAddCqlFilter()
      }

      layerConverted.value.addTo(map.value);
      layerControl.value.addOverlay(layerConverted.value, layerConverted.value.options.key);
    }

  } else {
    if (map.value.hasLayer(layerConverted.value)) {
      map.value.removeLayer(layerConverted.value);
      layerControl.value.removeLayer(layerConverted.value);
    }
  }
}

function checkAddCqlFilter(){
  if(filters.value){
    let cqlFilters = ''
    const childLayerOptions = layerConverted.value.options?.options
    const hasOptions = !!Object.keys(childLayerOptions).length

    if (hasOptions) {
      filters.value.forEach((filter) => {
        const foundFilter = childLayerOptions.find((item) => item.filter === filter.typeFilter)
        if (foundFilter) {
          if(cqlFilters) { cqlFilters += ' OR ' }

          cqlFilters += `${foundFilter.keyGeoserver} IN ('${filter.valueFilter}')`
        }
      })
      if(cqlFilters) {
        layerConverted.value.setParams({ CQL_FILTER: cqlFilters })
      }
    }
  }
} 

function addCqlFilterByRestrictedArea(entity){
  if(!entity) return

  const hasCities = !!entity.cities?.length
  const hasUf = !!entity.uf
  const hasCar = !!entity.car

  if(hasCar) {
    const newLayer = layerConverted.value.options.options[0].layer
    layerConverted.value.setParams({
      layers: newLayer,
      viewParams: `cod:${entity.car.codeProperty}`
    })

    return
  }
  
  let cqlFilters = '';

  if (hasUf) {

    cqlFilters += `uf='${entity.uf.id}'`
    
    if(hasCities) {
      const citiesIn = `IN ('${entity.cities.map((city) => city.name).join(',')}')`

      cqlFilters += ` AND municipio ${citiesIn}`
      
    }

    layerConverted.value.setParams({ CQL_FILTER: cqlFilters })

  }
} 

function convertToWms(layer) {
  const tileLayer = L.tileLayer.wms(layer.baseUrl, {
    layers: layer.layers,
    format: layer.format || 'image/png',
    tiled: true,
    transparent: layer.transparent !== undefined ? layer.transparent : true,
    attribution: layer.name || '',
    key: layer.key || '',
    minZoom: layer.minZoom || 4,
    maxZoom: layer.maxZoom || 17,
    options: layer.options || {},
  });

  return tileLayer
}

function getIndexElMenu(){
  return `${props.index + 1}-${props.index}`
}

watch(() => props.layer.visible, (newValue) => {
  localLayerVisible.value = newValue;
  toggleVisible()
});

</script>

<style scoped>
.el-menu-item {
  display: flex;
  flex-direction: row;
  min-height: fit-content;
}

.el-divider {
  margin-top: 0px;
  margin-bottom: 0px;
}

.switch-component {
  display: flex;
  justify-content: center;
  align-items: center;
}

.conteiner {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  font-size: 0.75rem;
}

.el-switch {
  margin-right: 5px;
}

.el-menu-item:focus,
.el-menu-item.is-active {
  color: #000000;
}

.el-sub-menu__icon-arrow {
    color: #42916E !important;
    font-weight: bold !important;
    font-size: 15px !important;
    transform: scale(1.3);
}

.el-sub-menu__title {
  margin: 0 !important;
  padding: 1px 0px !important;
}

.el-menu-item {
  padding: 2px 15px !important;
}

.title {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 235px;
  max-width: 235px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 150%;
  margin-block: auto;
}

.title .cor-legenda {
  display: inline-block;
  min-width: 8px;
  height: 8px;
  border: 1px solid;
}
</style>

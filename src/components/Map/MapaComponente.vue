<template>
  <div class="container" :style="{ height: mapSize }">
    <el-button
      @click="isMenuOpen = !isMenuOpen"
      class="menu-button"
      :class="{ open: isMenuOpen, closed: !isMenuOpen }"
    >
      <i :style="{ color: '#42916E' }" :class=" isMenuOpen ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right' "></i>
    </el-button>
    <el-menu
      v-if="layers"
      :class="{ 'custom-menu': true, open: isMenuOpen, closed: !isMenuOpen }"
      :style="{ height: mapSize }"
      mode="vertical"
      background-color="#fff"
      text-color="#000"
      active-text-color="#409EFF"
    >
      <LayerGroupCar 
        v-for="(group, index) in layers.groups" 
        :key="group.key" 
        :group="group" 
        :index="index" 
        :map="map"
      />
    </el-menu>
    <div id="map" :style="{ height: mapSize }"></div>
  </div>
</template>

<script setup>
import eventBus from '@/utils/eventBus';
import 'leaflet/dist/leaflet.css';
import { computed, onMounted, provide, ref, watch, onBeforeUnmount } from 'vue';
import LayerGroupCar from './LayerGroupCar.vue';
import MapManager from './mapManager';

const props = defineProps({
  mapData: Object
})

let mapManager

const isMenuOpen = ref(false);
const map = ref(null);
const mapSize = ref('70vh');
const layers = ref(null);
const layerControl = ref(null);
const filters = ref(null);
const filterUfLayerUf = ref(null);

onMounted(async () => {
    await initMap();

    eventBus.$on('updateFilters', (newFilters) => {
        filters.value = newFilters;
    });
});

onBeforeUnmount(() => {
    eventBus.$off('updateFilters');
});

const initMap = async () => {
  mapManager = new MapManager()

  await mapManager.buildMap({
    baseData: props.mapData.baseLayers, 
    carData: props.mapData.carLayers
  })

  map.value = mapManager.map
  layerControl.value = mapManager.layerControl
  layers.value = mapManager.layers
}

watch(() => props.mapData.filters, async(value) => {
  const { car, cities, uf } = value

  switch (!!value) {

  case !!car:
    mapManager.handleFilterZoom(car);
    mapManager.addCqlFilterByRestrictedArea({ car });
    break;

  case !!cities.length: {
    mapManager.handleFilterZoom({ cities });
    
    const namesCities = cities.map((city) => city.name).join("','");
    mapManager.reloadUf({ typeFilter: 'uf', valueFilter: uf.name });
    filterUfLayerUf.value = [{ typeFilter: 'uf', valueFilter: uf.name }];
    
    const filterMunicipio = [{ typeFilter: 'municipio', valueFilter: namesCities }];
    mapManager.reloadActiveLayers(filterMunicipio);
    filters.value = filterMunicipio;

    mapManager.addCqlFilterByRestrictedArea({ cities, uf });
    
    map.value = mapManager.map
    layerControl.value = mapManager.layerControl
    break;

  }
  default: {
    mapManager.handleFilterZoom({ bounderBox: uf.region });
      
    const filterUf = [
      { typeFilter: 'uf', valueFilter: uf.name },
      { typeFilter: 'uf', valueFilter: uf.id }
    ];

    mapManager.reloadActiveLayers(filterUf);
    mapManager.addCqlFilterByRestrictedArea({ uf });
    filters.value = filterUf;
    map.value = mapManager.map
    layerControl.value = mapManager.layerControl
    break;
    
  }
  }
})

provide('mapProvide', map);
provide('layerControl', layerControl);
provide('filters', filters);
provide('mapFilters', computed(() => props.mapData.filters));
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid #70707045;
  border-radius: 7px;
}

.custom-menu {
  position: absolute;
  top: 50%;
  left: -400px;
  transform: translateY(-50%);
  width: 400px;
  z-index: 1001;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  transition: left 0.3s ease-in-out;
  overflow-y: scroll;
  scrollbar-width: none;
  max-height: 70vh;
}

.open {
  left: 0;
}

.closed {
  left: -400px;
}

.menu-button {
  position: absolute;
  top: 50%;
  left: -50px;
  transform: translateY(-50%);
  z-index: 1002;
  background-color: #ffffff;
  color: black;
  cursor: pointer;
  height: 40px;
  width: 40px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  transition: left 0.3s ease-in-out;
}

.menu-button.open {
  left: 400px;
}

.menu-button.closed {
  left: -2px;
}

.map-container {
  width: 100%;
  height: 100vh;
  background-color: #ddd;
  position: relative;
}

#map {
  width: 100%;
}
</style>
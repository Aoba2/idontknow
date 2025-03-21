<template>
  <el-sub-menu :index="String(index)">
    <template #title>
      <div class="conteiner">
        <div class="title">{{ group.name }}</div>
        <span class="switch-component">
          <el-switch v-model="visibleAll" @change="toggleVisibleAll" @click.stop>
            <template #active-action>
              <i :style="{ fontSize: '10px', color: '#42916E' }" class="fa-solid fa-check"></i>
            </template>
            <template #inactive-action>
              <i :style="{ fontSize: '10px' }" class="fa-solid fa-xmark"></i>
            </template>
          </el-switch>
          <p class="status">{{ visibleAll ? $t('label.active') : $t('label.off') }}</p>
          <el-divider class="bar" direction="vertical"></el-divider>
        </span>
      </div>
    </template>

    <LayerMapCar v-for="(layer, index) in group.layers"
    :key="layer.key"
    :index="index"
    :layer="layer"
    :layerVisible="layer.visible"
    @updateVisibleAllSwitch="updateVisibleAllSwitch"
    :visibleAll="visibleAll"
    />
  </el-sub-menu>
  <el-divider/>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import LayerMapCar from './LayerMapCar.vue';

const visibleAll = ref(false);

const props = defineProps({
  map: {
    type: Object,
    default: () => ({})
  },
  group: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number
  }
});

const layersRef = ref([...props.group.layers]);

onMounted(() => {
  checkValueAllSwitch()
})

function updateVisibleAllSwitch(visible, key) {

  layersRef?.value?.forEach((l) => {
    if (key === l.key) {;
      l.visible = visible;
    }
  });

  checkValueAllSwitch()
}

function checkValueAllSwitch () {
  visibleAll.value = layersRef.value.some(layer => layer.visible)
    ? true
    : layersRef.value.every(layer => !layer.visible)
      ? false
      : visibleAll.value;
}

function toggleVisibleAll (newValue) {
  layersRef?.value?.forEach((l) => {
    l.visible = newValue;
  });
}

</script>

<style scoped>
.el-divider {
  margin-top: 0px;
  margin-bottom: 0px;
  border-top-width: 2px ;
}

.switch-component {
  display: flex;
  justify-content: center;
  align-items: center;
}

.conteiner {
  display: flex;
  gap: 10px;
  width: 100%;
  font-size: 0.75rem;
}

.el-switch {
  margin-right: 5px;
}

.status {
  width: 65px;
}

.title {
  width: 205px;
  max-width: 205px;
  word-wrap: break-word;
  white-space: normal;
  line-height: 150%;
  margin-block: auto;
  font-weight: bold;
}

.bar {
  height: 20px;
  border-left-width: 2px;
  margin-left: 2px;
}
</style>
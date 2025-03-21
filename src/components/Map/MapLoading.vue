<template>
  <div v-if="isLoading" class="map-loading">
    <img src="../../assets/icon/loading.gif" />
  </div>
</template>

<script setup>
defineProps({ isLoading: Boolean })
</script>

<style>
  .container .map-loading {
    position: absolute;
    inset: 0px;
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(108, 117, 125, 0.5);
    z-index: 1500;
  }
</style>

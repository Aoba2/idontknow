<template>
  <button
    class="custom-button"
    :class="{ 'state-active': isState, 'custom-button': !isState }"
  >
    <img v-if="regionData?.flag" :src="regionData.flag" alt="Flag" class="flag-icon" />
    <span class="button-text">{{ text ? text : regionData?.name }}</span>
  </button>
</template>

<script setup>

defineProps({
  text: {
    type: String,
  },
  regionData: {
    type: Object
  },
  isState: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.custom-button {
  width: 155px;
  border-radius: 4px;
  margin: 0 10px;
  background-color: rgb(255, 255, 255);
  transition: background-color 0.4s ease, color 0.4s ease;
  border: 1px solid #707070;
  color: #42916E;
  min-height: 40px;
  max-height: 40px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.custom-button:hover {
  background-color: #42916E;
  color: white;
}

.custom-button.clicked {
  background-color: #42916E;
  color: white;
}

.state-active {
  display: flex;
  align-items: center;
  justify-content: left;
}

.button-text {
  font-size: 14px;
}

.flag-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
</style>
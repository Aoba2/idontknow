<template>
  <div class="card-container">
    <div class="title-container">
      <h2>{{ title }}</h2>
    </div>
    <div class="data-container">
      <p>{{ formatValue(sum) }} <span>{{unitOfMeasurement}}</span></p>
      <div class="non-mandatory-data-container">
        <span class="opt">
          {{ formatValueInt(optionalDataValue) }} {{ optionalDataName }}
        </span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { formatValue, formatValueInt } from '../utils/utils';

defineProps({
  title: String,
  sum: Number,
  unitOfMeasurement: String,
  optionalDataValue: [Number, String],
  optionalDataName: String
})
</script>

<style scoped>
.card-container {
  display: grid;
  grid-template-rows: 1fr repeat(2, 60px);
  width: 100%;
  color: #333;
  height: 150px;
  border-radius: 4px;
  box-shadow: 0px -5px 8px 2px #f5f5f5;
}

.data-container {
  background-color: #FFF;
  height: 87px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  box-shadow: 0px 8px 8px 2px #f5f5f5;

  p {
    font-size: 21px;
  }

  span {
    font-size: 14px;
  }
}

.non-mandatory-data-container {
  background-color: #FFF;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 4px;
}

.title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 79px;
  padding: 0 10px;
  word-wrap: break-word;

  h2 {
    width: 100%;
    font-size: 18px;
    text-align: center;
    font-weight: 100;
  }
}
</style>
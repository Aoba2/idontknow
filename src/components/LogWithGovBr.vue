<template>
  <div class="accessGovContainer" :class="{ shadow: hasShadow }">
    <h3>{{ title }}</h3>
    <p class="title">{{ message }}</p>
    <div class="button">
      <ButtonGovBr :withIcon="false"/>
    </div>
  </div>
</template>

<script setup>
import ButtonGovBr from './ButtonGovBr.vue';

defineProps({
  message: {
    type: String
  },
  hasShadow: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  }
});
</script>

<style scoped>
.accessGovContainer {
  width: 500px;
  background-color: #F5F9F8;
  display: flex;
  flex-direction: column;
  padding: 25px;
}

.shadow {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
}

.content {
  display: flex;
  flex-direction: column;
}

h3 {
  color: #42916E;
}

p {
  color: #333333;
  font-size: 16px;
}

.title {
  margin-top: 18px;
  margin-bottom: 18px;
}

.button {
  width: 50%;
}

@media screen and (max-width: 950px) {
  .accessGovContainer {
    width: 80%;
  }
}
</style>

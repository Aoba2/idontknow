<template>
  <div class="more-contents-card-container">
    <label>{{ description }}</label>
    <li class="title">
      <router-link :to="routerTo">
        <strong>{{ namePage }}</strong>
      </router-link>
    </li>
  </div>
</template>

<script setup>

defineProps({
  description: {
    type: String
  },
  namePage: {
    type: String,
  },
  routerTo: {
    type: String,
  }
});

</script>

<style scoped>
.more-contents-card-container {
  display: flex;
  flex-direction: column;
  width: 25%;
  gap: 15px;
  background: #FFF;
  padding: 0 22px;
  padding-top: 16px;
  padding-bottom: 20px;
  justify-content: center;
  box-shadow: 0px 1px 6px #00000029;
  border-radius: 8px;

  label {
    width: 100%;
    margin-top: 12px;
    color: #555555;
    font-size: 16px;
  }

  .title {
    color: #0C326F;
    font-size: 25px;
    padding: 12px 0px 16px;
    text-decoration: none;
  }
}

@media (max-width: 984px) {
  .more-contents-card-container {
    width: 88%;
  }
}
</style>
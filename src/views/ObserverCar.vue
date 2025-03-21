<script setup>

</script>

<template>
  <div class="banner-content">
    <h1>{{ $t('pages.observatory') }}</h1>
  </div>
</template>

<style scoped>
.banner-content {
  background: #FDFAEF;
  padding: 30px 20px;
  color: #42916E;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;

  h1 {
    font-size: 40px;
    font-weight: 100;
    font-style: italic;
    margin-left: 50px;
  }

  h2 {
    font-size: 24px;
    font-weight: 100;
  }

}
</style>
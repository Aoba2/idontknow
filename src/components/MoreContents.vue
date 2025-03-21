<template>
  <div class="more-contents-container">
    <h6 class="more-contents-title">{{ $t('footer.moreContent') }}</h6>
    <p>{{ $t('footer.seeInformation') }}</p>
    <div class="more-contents-cards-container">
      <MoreContentsCard v-for="(card, index) in cards" :key="index" :description="$t(card.description)"
        :namePage="$t(card.namePage)" :routerTo="card.routerTo" />
    </div>
  </div>
</template>

<script setup>
import MoreContentsCard from './MoreContentsCard.vue';

defineProps({
  cards: {
    type: Array,
    required: true
  }
});

</script>

<style scoped>
.more-contents-container {
  background: rgba(191, 235, 220, 0.27);
  margin-top: 40px;
  width: 90%;
  height: 308px;
  padding: 0 5%;
  padding-bottom: 20px;
  text-decoration: none !important;

  h6 {
    padding: 52px 0 12px;
    font-size: 20px;
    color: #42916e;
    font-weight: 600;
    text-transform: uppercase;
  }

  p {
    font-size: 17px;
  }
}

.more-contents-cards-container {
  display: flex;
  flex-direction: row;
  padding-top: 32px;
  margin-bottom: 20px;
  gap: 32px;
}

@media screen and (max-width: 984px) {

  .more-contents-container {
    height: auto;
  }

  .more-contents-cards-container {
    flex-direction: column;
  }
}
</style>

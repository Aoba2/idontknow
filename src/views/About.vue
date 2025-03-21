<template>
  <div class="banner-container">
    <div class="banner-content">
      <h1>{{ $t('pages.about') }}</h1>
    </div>
  </div>
  <div class="description-container">
    <div class="description-content">
      <p>{{ $t('about.paragraphOne') }}</p>
      <p class="no-ident">{{ $t('about.isPossible') }}</p>
      <ul>
        <li>{{ $t('about.topicOne') }}</li>
        <li>{{ $t('about.topicTwo') }}</li>
        <li>{{ $t('about.topicThree') }}</li>
        <li>{{ $t('about.topicFour') }}</li>
      </ul>
      <p>{{ $t('about.paragraphTwo') }}</p>
      <p class="no-ident">{{ $t('about.paragraphThree') }}</p>
    </div>
  </div>
  <div class="more-contents-container-about">
    <MoreContents :cards="pageCards" />
  </div>
  <div class="footer-container-about">
    <Footer />
  </div>
</template>

<script setup>
import Footer from '../components/Footer.vue';
import MoreContents from '../components/MoreContents.vue';

const pageCards = [
  { description: 'card.description.seeOneOrMore', namePage: 'pages.home', routerTo: '/' },
  /*
   * { description: 'card.description.checkInformation', namePage: 'pages.observatory', routerTo: '/car-observatory' },
   * { description: 'card.description.getTheData', namePage: 'pages.dynamicReports', routerTo: '/dynamic-report' },
   */
  { description: 'card.description.downloadData', namePage: 'pages.geoservices', routerTo: '/geoservices' }
];

</script>

<style scoped>

.no-ident {
  text-indent: 0;
}

.banner-container {
  padding-top: 10px;
  width: 94%;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
  margin-left: 3%;
}

.banner-content {
  background: #FDFAEF;
  padding: 30px 0;
  color: #42916E;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  padding-right: 50px;

  h1,
  p,
  li {
    margin-left: 50px;
    line-height: 2;
  }

  h1 {
    font-size: 40px;
    font-weight: 100;
    margin-left: 50px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 24px;
    font-weight: 100;
  }

  p {
    text-align: justify;
    color: #333333;
    font-size: 17px;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  li {
    list-style: inside;
    color: #333333;
    font-size: 17px;
  }
}

.description-container {
  padding-top: 10px;
  width: 94%;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
  margin-left: 3%;
}

.description-content {
  background: #F2F2F2;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px;
  padding-left: 30px;
  line-height: 2;
  text-indent: 1.1em;

  ul {
    padding: 20px 0;

    li {
      list-style: inside;
    }
  }
}
</style>

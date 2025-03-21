<template>
  <div>
    <div class="banner-container">
      <div class="banner-content">
        <h1>{{ $t('pages.geoservices') }}</h1>
      </div>
    </div>
    <div class="aling" v-if="checkNeedAuthenticate">
      <div class="content-general">
        <div class="filter-container">
          <div class="filter-container-margin">
            <div class="filter-fields-container">
              <div class="region-container">
                <div class="region-container-margin">
                  <div class="title-card-regions-container">
                    <span>{{ $t('message.selectRegionsToAccessGeoServices') }}</span>
                  </div>
                  <div class="card-regions-container">
                    <div class="regions-container" v-for="(region, index) in regionsWithStates" :key="region.id">
                      <CustomBtn :isState="false" :text="region.name"
                        @click.prevent="showStates(region.name, region.id, index)"
                        :class="{ clicked: selectedRegionIndex === index }" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="states-and-municipalities-filter-container" v-if="selectedRegion.length > 0">
                <div class="states-container">
                  <span>{{ $t('message.statesOfSelectedRegion') }}</span>
                  <div class="state-buttons-container" v-if="toogleSelectedRegion">
                    <div class="state-btn" v-for="(state, index) in selectedRegion" :key="state.name">
                      <div @click.prevent="showMunicipalities(state.id, index)">
                        <CustomBtn :regionData="state" :class="{ clicked: index === selectedStateIndex }" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="filter-by-container" v-if="currentState">
                  <h3 class="filterBy">{{ $t('label.filterBy') }}</h3>
                  <div class="label-fields-container">
                    <div class="label">
                      <label>
                        {{ $t('label.city') }}
                      </label>
                      <el-select size="large" v-model="citySelect" :placeholder="$t('label.select')" filterable>
                        <template #prefix>
                          <i class="fa fa-search"></i>
                        </template>
                        <el-option v-for="municipality in cityUF" :key="municipality.nome" :label="municipality.name"
                          :value="municipality.name"></el-option>
                      </el-select>
                    </div>

                    <div class="label">
                      <label>{{ $t('label.service') }}</label>
                      <el-select
                        multiple
                        :max-collapse-tags="4"
                        collapse-tags
                        collapse-tags-tooltip
                        size="large"
                        v-model="environmentalThemeSelected"
                        :placeholder="$t('label.select')"
                        filterable
                        class="select-theme"
                        >
                        <el-option v-for="environmentalTheme in themesLayerConfig" :key="environmentalTheme.id"
                          :label="environmentalTheme.name" :value="environmentalTheme.code"></el-option>
                      </el-select>
                    </div>
                    <div class="btn-container">
                      <el-button type="primary" @click="getThemes()">{{ $t('button.search') }}</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-image-selected-container">
                <img src="../assets/noRegionSelected.svg" alt="image">
                <span>{{ $t('message.noOneRegionSelected') }}</span>
              </div>
            </div>
          </div>

          <el-table v-if="(currentState && allThemes?.length > 0) && !loading" :data="allThemes" style="width: 100%;" header-row-class-name="header-font">
            <el-table-column class-name="" prop="name" :label="$t('themes.topic')" width="600" />
            <el-table-column :label="$t('themes.services')" header-align="center">
              <template v-slot="scope">
                <div class="btn-geosservices-table">
                  <el-button  @click="copyLink(scope.row?.linkWms, 'WMS')" style="border: none;" class="download-theme">
                    <span>WMS</span>
                  </el-button>
                  <el-button @click="copyLink(scope.row?.linkWfs, 'WFS')" style="border: none;" class="download-theme">
                    WFS
                  </el-button>
                  <el-button class="download-theme" style="border: none; margin: 0;">
                    <template v-if="loadingButtonsMap[scope.row.name]">
                      <i class="fa-solid fa-spinner el-column-download spin"></i>
                    </template>
                    <el-dropdown v-else>
                      <span>
                        Mapas
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item disabled>Mapas</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="openLink(scope.row?.linkMap?.openLayers)">Open Layers</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="copyLink(scope.row?.linkMap?.gml, 'gml')">GML</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="downloadImageGeoService(scope.row?.linkMap?.kml, 'kml', scope.row.name)">KML</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="downloadImageGeoService(scope.row?.linkMap?.tiff, 'tiff', scope.row.name)">TIFF</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="downloadImageGeoService(scope.row?.linkMap?.gif, 'gif', scope.row.name)">GIF</el-dropdown-item>
                          <el-dropdown-item divided class="download-dropdown"
                            @click="downloadImageGeoService(scope.row?.linkMap?.jpeg, 'jpeg', scope.row.name)">JPEG</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="loading" v-else>
            <MapLoading :isLoading="loading"/>
          </div>
        </div>
        <div class="map-container" v-if="false">
          <div id="map"></div>
        </div>
      </div>
    </div>
    <div class="content-gov" v-else>
      <LogWithGovBr :title="$t('logWithGovBr.title.geoServices')" :message="$t('logWithGovBr.message.geoServices')"
        :hasShadow="true" />
    </div>
    <div class="more-contents-container">
      <MoreContents :cards="pageCards" />
    </div>
    <div class="footer-container">
      <Footer>
        <template v-slot:circle-images></template>
        <template v-slot:retangle-images></template>
      </Footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { getCitiesByUf, getRegionsWithStates, getEnvironmentalTheme } from '../services/dataStateCitiesTotalizers.js'
import "leaflet/dist/leaflet.css";
import CustomBtn from '@/components/CustomBtn.vue';
import MoreContents from '@/components/MoreContents.vue';
import Footer from '@/components/Footer.vue';
import { addFlagToState } from '../constants/regions.js';
import dataUser from '../store/user.js'
import { copyToClipboard, getLocalStorageWithExpiry } from '../utils/utils.js';
import LogWithGovBr from '../components/LogWithGovBr.vue';
import { getGeoServerLayerLink, getAllThemesByLayersConfig, getDownload } from '../services/map.js';
import MapLoading from '../components/Map/MapLoading.vue';
import { toast } from 'vue3-toastify';
import { i18n } from '../main.js';

const toogleSelectedRegion = ref('')
const selectedRegion = ref([]);
const cityUF = ref([]);
const regionsWithStates = ref([])
const selectedRegionIndex = ref(null)
const selectedStateIndex = ref(null)
const citySelect = ref(null)
const currentRegion = ref(null)
const currentState = ref(null)
const environmentalThemeSelected = ref([])
const environmentalThemes = ref([])
const accessManager = ref({})
const isAuthenticated = computed(() => !!getLocalStorageWithExpiry("userPublicar"));
const pageCards = [
  { description: 'card.description.seeOneOrMore', namePage: 'pages.home', routerTo: '/' },
  /*
   * { description: 'card.description.checkInformation', namePage: 'pages.observatory', routerTo: '/car-observatory' },
   * { description: 'card.description.getTheData', namePage: 'pages.dynamicReports', routerTo: '/dynamic-report' },
   */
  { description: 'card.description.findOut', namePage: 'pages.about', routerTo: '/about' }
];
const allThemes = ref([])
const loading = ref(false)
const themesLayerConfig = ref([])
const loadingButtonsMap = reactive({})

onMounted(async () => {

  dataUser.dispatch("loadUser");

  if (!Object.keys(dataUser.state.accessManager).length) {
    await dataUser.dispatch("getAccessManager");
  }
  accessManager.value = dataUser.state?.accessManager

  const resp = await getAllThemesByLayersConfig()
  themesLayerConfig.value = resp.data
})

const checkNeedAuthenticate = computed(() => {
  return accessManager.value?.geoservices ? isAuthenticated.value : true
})

async function getAllRegionsWithStates() {
  const res = await getRegionsWithStates()

  regionsWithStates.value = res.data
}

function openLink(link) {
  window.open(link, "_blank");
}

async function downloadImageGeoService (link, typeFile, fileName) {
  try {
    loadingButtonsMap[fileName] = true
    const response = await getDownload(link, typeFile);
    const blob = response.data;
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    if(typeFile === "gml"){
      anchor.download = fileName + "application/gml+xml"
    } else {
      anchor.download = fileName + "." + typeFile;
    }
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  } catch {
    toast.error(i18n.global.t('messageToast.error.download'))
  } finally {
    loadingButtonsMap[fileName] = false
  }
}

async function copyLink(link, type) {
  copyToClipboard(link, type)
}

function showStates(regionName, index) {
  currentRegion.value = regionName
  showMunicipalities(null, null)
  selectedRegionIndex.value = index - 1
  selectedRegion.value = []
  let states = []
  const statesWithFlag = []
  toogleSelectedRegion.value = true
  regionsWithStates.value.forEach(element => {
    if (element.name === regionName) {
      states = element.states
    }
  })
  states.map(e => {
    statesWithFlag.push({
      id: e.id,
      code: e.code,
      name: e.name,
      flag: addFlagToState(e.id)
    })
  })
  selectedRegion.value = statesWithFlag
}

async function showMunicipalities(sigla, index) {

  currentState.value = sigla
  if (sigla === null) {
    citySelect.value = ''
    selectedStateIndex.value = null
  } else {
    selectedStateIndex.value = index
    const response = await getCitiesByUf(sigla)
    const recievingMunicipalities = response.data
    const sortedResponse = recievingMunicipalities.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); 
    cityUF.value = sortedResponse
  }
}

async function getAllEnvironmentalThemes() {
  const response = await getEnvironmentalTheme()
  const recievingEnvironmentalTheme = response.data
  const sortedResponse = recievingEnvironmentalTheme.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  environmentalThemes.value = sortedResponse
}

async function getThemes() {
  loading.value = true
  const resp = await getGeoServerLayerLink(currentState.value, citySelect.value, environmentalThemeSelected.value)
  allThemes.value = resp.data
  loading.value = false
}

watch(currentRegion, (novoValor) => {
  if (novoValor) {
    citySelect.value = ''
    cityUF.value = ''
    environmentalThemeSelected.value = []
  }
})

watch(currentState, async (novoValor) => {
  if (novoValor) {
    citySelect.value = ''
    cityUF.value = ''
  }
  getThemes()
})

getAllRegionsWithStates()
getAllEnvironmentalThemes()
</script>

<style scoped>
.clicked {
  background-color: #42916E;
}

.select-theme {
  width: 462px;
}

.label {
  display: flex;
  flex-direction: column;
}

.content-gov {
  margin-left: 3%;
  width: 500px;
}

.btn-geosservices-table {
  display: flex;
  flex-direction: row;
  gap: 48px;
  margin-left: 47.5%;
}

.main-container {
  background: #F8F8F8;
}

.banner-container {
  padding-top: 10px;
  height: 180px;
  width: 94%;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
  margin-left: 3%;
}

.filterBy {
  margin-top: 30px;
  margin-bottom: 30px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner-content {
  background: #FDFAEF;
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

.filter-container-margin {
  padding-top: 16px;
  padding-bottom: 16px;
}

.card-regions-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.region-container-margin {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.regions-container {
  padding: 8px 0;
}

.card-regions container .filter-container {
  width: 100%;
  background: #F2F2F2;

  h3 {
    font-size: 22px;
    margin-bottom: 15px;
    margin-top: 15px;
    color: #333;
  }

  span {
    font-size: larger;
  }
}

.download-theme {
  width: 40px;
  background: none;
  color: #0a2f6b;
}

.filter-fields-container {
  display: flex;
  flex-direction: column;
  padding-top: 22px;
  gap: 30px;
  padding-inline: 15px;
  padding-bottom: 10px;
  background: #F5F3F3 0% 0% no-repeat padding-box;

  span {
    font-size: 18px;
  }

}

.no-image-selected-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 43px;
  padding: 70px 0;
}

.no-image-selected-container img {
  width: 20%;
}

.no-image-selected-container span {
  font-size: 30px;
  color: #333333;
  width: 250px;
}

.content-general {
  width: 92%;
}

.aling {
  width: 100%;
  display: flex;
  justify-content: center;
}

.label-fields-container {
  display: flex;
  flex-direction: row;
  gap: 30px;
}

.el-row {
  width: 370px;
  margin-right: 16px;

  label {
    font-weight: bold;
  }

}

.btn-container {
  width: 90px;
  margin-top: 17px;
  height: 39px;
}

.states-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 33px;
}

#map {
  width: 100%;
  margin-top: 16px;
  height: 502px;
  max-height: 100%;
}

.state-buttons-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.state-btn {
  margin: 8px 0;
}

.content-services {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background: #F2F2F2;
  margin-top: 1%;
  height: 60px;
}

.content-services span {
  font-weight: 600;
  color: #1351B4;
}

@media screen and (max-width: 984px) {

  .card-regions-container,
  .state-buttons-container {
    justify-content: center;
  }

}
</style>
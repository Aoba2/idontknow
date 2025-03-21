<template>
  <div v-loading.fullscreen.lock="loading" class="main-container">
    <div class="banner-container">
      <div class="br-map">
        <img src="../assets/banner-novo-consulta-publica-2.png" alt="" />
      </div>
      <div class="banner-content">
        <h1><strong class="project-name">{{ $t('projectName') }}</strong></h1>
        <h2>{{ $t('message.publicPortal') }}</h2>
      </div>
    </div>
    <div class="main-page-container">
      <div class="content-general">
        <div class="filter-container">
          <div class="filter-container-margin">
            <span class="title-checkRegistered">{{ $t('message.checkRegistered') }}</span>
            <div class="filter-fields-container">
              <div class="select-uf">
                <label>
                  UF
                  <el-select size="large" :placeholder="$t('label.ufPlaceholder')" v-model="ufCurrent" filterable
                    class="custom-select" @change="handleSelectedStateChange" clearable>
                    <el-option v-for="ufs in federativeUnits" :key="ufs.id" :label="ufs.id + ' - ' + ufs.name"
                      :value="ufs.id"></el-option>
                  </el-select>
                </label>
              </div>
              <div class="select-cities">
                <label class="m-4">
                  {{ $t('label.city') }}
                  <el-select multiple size="large" v-model="cityCurrent" :placeholder="$t('label.cityPlaceholder')"
                    filterable class="custom-select">
                    <template #prefix>
                      <i class="fa fa-search"></i>
                    </template>
                    <el-option v-for="city in cities" :key="city.id" :label="city.name" :value="city.name"></el-option>
                  </el-select>
                </label>
              </div>
              <div class="number-car">
                <label>
                  {{ $t('label.carNumber') }}
                  <el-input size="large" type=" text" :placeholder="$t('label.carPlaceholder')"
                    v-model="registrationNumberCar" @input="formatCar" maxlength="50" />
                </label>
              </div>
              <div class="btns-container">
                <span class="btn-container">
                  <el-button type="primary" @click="handleSearch()">{{ $t('button.search') }}</el-button>
                </span>
                <span v-if="showClear" class="btn-container">
                  <el-button @click="clear()" class="invertedColorButton">{{ $t('button.clear') }}</el-button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <transition name="el-fade-in-linear">
          <div v-if="!infosCar">
            <div class="data-cards">
              <div class="data-card-container" v-for="(total, index) in allTotalizers" :key="total.id">
                <DataCard :title="total.name" :style="{ backgroundColor: colors[index] }" :sum="total.value"
                  :optionalDataValue="total.subItemValue" :optionalDataName="total.subItemName" :unitOfMeasurement="total.unitOfMeasurement"/>
              </div>
            </div>
          </div>
        </transition>
        <div v-if="showMap">
          <ElSkeleton animated v-if="mapData.showSkeleton">
            <template #template>
              <ElSkeletonItem variant="rect" style="height: 70vh;" />
            </template>
          </ElSkeleton>
          <MapaComponente v-else :mapData="mapData" />
        </div>
        <div v-else>
          <LogWithGovBr :title="$t('logWithGovBr.title.data')" :message="$t('logWithGovBr.message.mapComponent')"
            :hasShadow="true" />
        </div>
        <div class="data-obtained-container" v-if="obtainedData">
          <span>{{ $t('label.obtainedData') }} {{ refreshDate }}</span>
        </div>
        <el-menu v-if="showDetailSearch" default-active="1" :default-openeds="['1']" class="el-menu-vertical">
          <el-sub-menu index="1">
            <template #title>
              <span class="title-menu">{{ $t("message.searchDetails") }}</span>
            </template>
            <p id="subtitle-menu">{{ $t('areaMessage.search') }}</p>
            <div class="table-container" v-if="checkNeedAuthenticateSeeDetails">
              <div class="table-container" v-if="checkNeedAuthenticateSeeDetails">
                <el-table v-if="citiesSelectedToSearch && citiesSelectedToSearch.length" :data="citiesSelectedToSearch">
                  <el-table-column>
                    <template #header>
                      <span class="el-column-themes" :style="{ color: '#1351B4', fontSize: '16px' }">
                        {{ $t('themes.results') }}
                      </span>
                    </template>
                    <template #default="scope">
                      <span class="el-column-themes">{{ scope.row }} / {{ ufCurrent }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="right" align="right">
                    <template #header >
                      <el-button v-if="amountOfselectedMunicipalities" type="primary column-download-all" @click="downloadAllBases()"
                        style="cursor: pointer;">{{
                          $t('themes.downloadAll')
                        }}</el-button>
                          <span v-else class="el-column-themes" :style="{ color: '#1351B4', fontSize: '16px' }">
                        {{ $t('themes.results') }}
                      </span>
                    </template>
                    <template #default="scope">
                      <i v-if="getStatus(scope.row) === 'LOADING'"
                        class="fa-solid fa-spinner el-column-download spin"></i>
                      <div v-else-if="getStatus(scope.row) === 'SUCCESS'" class="error-download"
                        @click="downloadIndividualBase(scope.row)">
                        <span class="el-column-download">{{ $t('themes.downloadAgain') }}</span>
                        <i class="status error fa-solid fa-check el-column-download">
                        </i>
                      </div>
                      <div v-else-if="getStatus(scope.row) === 'ERROR'" class="error-download"
                        @click="downloadIndividualBase(scope.row)">
                        <span class="el-column-download">{{ $t('message.tryAgain') }}</span>
                        <i class="status error fa-solid fa-circle-exclamation el-column-download"> </i>
                      </div>
                      <i v-else-if="getStatus(scope.row) === 'NOT_STARTED'"
                        class="status error fa-solid fa-download el-column-download"
                        @click="downloadIndividualBase(scope.row)"></i>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table v-else-if="ufSelectedToSearch && ufSelectedToSearch.length" :data="[ufSelectedToSearch]">
                  <el-table-column>
                    <template #header>
                      <span class="el-column-themes" :style="{ color: '#1351B4', fontSize: '16px' }">
                        {{ $t('themes.results') }} </span>
                    </template>
                    <template #default="scope">
                      <span class="el-column-themes">{{ scope.row }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column header-align="right" align="right">
                    <template #header>
                      <span class="el-column-download-header" :style="{ color: '#1351B4', fontSize: '16px' }"> {{
                        $t('themes.download') }} </span>
                    </template>
                    <template #default="scope">
                      <i v-if="getStateStatus(scope.row) === 'LOADING'"
                        class="fa-solid fa-spinner el-column-download spin"></i>
                      <div v-else-if="getStateStatus(scope.row) === 'SUCCESS'" class="error-download"
                        @click="downloadStateBase(scope.row)">
                        <span class="el-column-download">{{ $t('themes.downloadAgain') }}</span>
                        <i class="status error fa-solid fa-check el-column-download">
                        </i>
                      </div>
                      <div v-else-if="getStateStatus(scope.row) === 'ERROR'" class="error-download"
                        @click="downloadStateBase(scope.row)">
                        <span class="el-column-download">{{ $t('message.tryAgain') }}</span>
                        <i class="status error fa-solid fa-circle-exclamation el-column-download"> </i>
                      </div>
                      <i v-else-if="getStateStatus(scope.row) === 'NOT_STARTED'"
                        class="status error fa-solid fa-download el-column-download"
                        @click="downloadStateBase(scope.row)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <LogWithGovBr v-else :title="$t('logWithGovBr.title.data')"
                :message="$t('logWithGovBr.message.downloadInformation')" />
            </div>
          </el-sub-menu>
        </el-menu>
        <el-menu v-if="showDetailSearchByCar" default-active="1" :default-openeds="['1']"
          class="el-menu-vertical-by-car">
          <el-sub-menu index="1">
            <template #title>
              <span class="title-menu">{{ $t("message.searchDetails") }}</span>
            </template>
            <div class="content-el-menu-byCar">
              <DetailSearchByCar 
                :infosCar="infosCar"
                  @recaptcha-verified="handleRecaptchaVerified"
                  @download-requested="handleDownloadRequested"
                />
            </div>
          </el-sub-menu>
        </el-menu>
        <div class="recaptcha-container">
          <vue-recaptcha v-if="someoneWantsDownload" sitekey="6Lc3Z-UqAAAAADr2u80W2XVfEZ6VfkxXATAxE52c" size="normal"
            theme="light" hl="pt-br" @verify="recaptchaVerified" />
        </div>
      </div>
    </div>
    <div>
      <MoreContents :cards="pageCards"/>
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
import { ref, onMounted, computed, watch} from 'vue'
import eventBus from '@/utils/eventBus';
import "leaflet/dist/leaflet.css";
import { i18n } from "../main.js";
import { validateRecaptcha } from '../services/recaptchaService.js'
import { toast } from 'vue3-toastify';
import DataCard from '../components/DataCard.vue';
import DetailSearchByCar from '../components/DetailSearchByCar.vue';
import Footer from '../components/Footer.vue';
import { getCitiesByUf, getDeatilsByIdentifier, getEnvironmentalTheme, getTotalizers, getUf, getDownloadBaseFromS3 } from '../services/dataStateCitiesTotalizers';
import dataUser from "../store/user.js";
import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from '../utils/utils';
import LogWithGovBr from '../components/LogWithGovBr.vue';
import MapaComponente from '../components/Map/MapaComponente.vue';
import MoreContents from "../components/MoreContents.vue";
import { getBaseMaps, getLayers } from '@/services/map'
import { ElSkeletonItem } from 'element-plus';
import { getRefreshedDate } from '../services/job.js';

const obtainedData = ref(false)
const refreshDate = ref(null)
const federativeUnits = ref([])
const cities = ref([])
const ufCurrent = ref('')
const cityCurrent = ref([])
const registrationNumberCar = ref('')
const allTotalizers = ref([])
const colors = ['#CED6E5', '#C1D2F2', '#98B7EC', '#97CCE3', '#B6C3D9']
const infosCar = ref(null)
const ufSelectedToSearch = ref('')
const citiesSelectedToSearch = ref([])
const isAuthenticated = computed(() => !!getLocalStorageWithExpiry("userPublicar"));
const accessManager = ref({})
const objectufCurrent = ref('')
const filterStore = ref({})
const envTheme = ref([])
const loading = ref(false)
const selectedMunicipalitiesStatus = ref([]);
const downloadStates = ref([]);
const failedMunicipalities = ref([])
const someoneWantsDownload = ref(false)
const isCaptchaValidated = ref(false)
const individualDownloadsBuffer = ref([])
const stateBaseBuffer = ref([])
const batchDownloadsBuffer = ref([])
const mapData = ref({
  baseLayers: null,
  carLayers: null,
  showSkeleton: false,
  filters: null
})
const warningToastId = ref(null)

const pageCards = [
  { description: 'card.description.downloadData', namePage: 'pages.geoservices', routerTo: '/geoservices' },
  /*
   * { description: 'card.description.checkInformation', namePage: 'pages.observatory', routerTo: '/car-observatory' },
   * { description: 'card.description.getTheData', namePage: 'pages.dynamicReports', routerTo: '/dynamic-report' },
   */
  { description: 'card.description.findOut', namePage: 'pages.about', routerTo: '/about' }
];

onMounted(async () => {
  loading.value = true
  dataUser.dispatch("loadUser");
  
  try {
    await getAllUfs()
    getCityByUf()
    getAllTotalizers()
    loadMapLayers()

    if (!Object.keys(dataUser.state.accessManager).length) {
      await dataUser.dispatch("getAccessManager");
    }

    filterStore.value = getLocalStorageWithExpiry("MainPageFilter")

    if (filterStore.value) {
      ufCurrent.value = filterStore.value.ufCurrent
      cityCurrent.value = filterStore.value.cityCurrent

    }

    accessManager.value = dataUser.state?.accessManager

    envTheme.value = await getEnvironmentalTheme()

  } catch {
    toast.error(i18n.global.t('messageToast.error.generic'))
  } finally {
    loading.value = false
    ufSelectedToSearch.value = federativeUnits.value.find(uf => uf.id === filterStore.value?.ufCurrent)?.name
    citiesSelectedToSearch.value = filterStore.value?.cityCurrent
    selectedMunicipalitiesStatus.value = citiesSelectedToSearch.value?.map((city) => {
      return {
        nameCity: city,
        uf: 'MG',
        status: "NOT_STARTED"
      }
    })
  }
})

const loadMapLayers = async () => {
  mapData.value.showSkeleton = true
  try {
    const [baseLayers, carLayers] = await Promise.all([
      getBaseMaps(),
      getLayers()
    ])
    mapData.value.baseLayers = baseLayers.data
    mapData.value.carLayers = carLayers.data
  } catch (error) {
    console.error(error)
  } finally {
    mapData.value.showSkeleton = false
  }
}

async function recaptchaVerified(response) {

  const result = await validateRecaptcha(response)

  if (result.status === 200) {
    isCaptchaValidated.value = true
  }

  if (individualDownloadsBuffer.value.length) {
    individualDownloadsBuffer.value.map(element => {
      downloadIndividualBase(element)
    })
  }

  if (stateBaseBuffer.value.length) {
    stateBaseBuffer.value.map(element => {
      downloadStateBase(element)
    })
  }

  if (batchDownloadsBuffer.value.length) {
    downloadAllBases()
  }

}

async function downloadIndividualBase(scope) {

  if (!isCaptchaValidated.value) {
    warningToastId.value = toast.warn(i18n.global.t('themes.recaptchaWarn'))
    someoneWantsDownload.value = true
  } else {
    someoneWantsDownload.value = false
  }

  if (!isCaptchaValidated.value) {
    individualDownloadsBuffer.value.push(scope)
    return;
  }

  if (warningToastId.value && isCaptchaValidated.value) {
    toast.update(warningToastId.value, {
      render: '',
      type: 'default',
      isLoading: false,
      autoClose: 100, 
    });
    warningToastId.value = null; 
  }

  if (individualDownloadsBuffer.value.length === 0) {
    selectedMunicipalitiesStatus.value.map(element => {
      if (element.nameCity === scope) {
        element.status = 'LOADING'
        selectedMunicipalitiesStatus.value.map((city) => {
          if (city.status === 'LOADING') {
            getThemeDownloadBase(city.nameCity).then((response) => {
              if (response === 200) {
                city.status = 'SUCCESS'
              } else {
                failedMunicipalities.value.push(city.nameCity)
                city.status = 'ERROR'
              }
            })
          }
        })
      }
    })
  } else {
    selectedMunicipalitiesStatus.value.map(element => {
      if (element.nameCity === scope) {
        element.status = 'LOADING'
        selectedMunicipalitiesStatus.value.map((city) => {
          if (city.status === 'LOADING') {
            getThemeDownloadBase(city.nameCity).then((response) => {
              if (response === 200) {
                city.status = 'SUCCESS'
              } else {
                failedMunicipalities.value.push(city.nameCity)
                city.status = 'ERROR'
              }
            })
          }
        })
      }
    })
  }

}

async function downloadAllBases() {

  if (!isCaptchaValidated.value) {
    warningToastId.value = toast.warn(i18n.global.t('themes.recaptchaWarn'))
    someoneWantsDownload.value = true
  } else {
    someoneWantsDownload.value = false
  }

  if (!isCaptchaValidated.value) {
    selectedMunicipalitiesStatus.value.map(element => {
      batchDownloadsBuffer.value.push(element)
    })
    return;
  }

  if (warningToastId.value && isCaptchaValidated.value) {
    toast.update(warningToastId.value, {
      render: '',
      type: 'default',
      isLoading: false,
      autoClose: 100, 
    });
    warningToastId.value = null; 
  }

  if (individualDownloadsBuffer.value.length === 0) {
    selectedMunicipalitiesStatus.value = citiesSelectedToSearch.value.map((city) => ({
      nameCity: city,
      uf: `${city}`,
      status: "LOADING",
    }));
    if (individualDownloadsBuffer.value.length === 0) {
    
      selectedMunicipalitiesStatus.value = citiesSelectedToSearch.value.map((city) => ({
        nameCity: city,
        uf: `${city}`,
        status: "LOADING",
      }));

      try {
        for (const city of selectedMunicipalitiesStatus.value) {
          try {
            const response = await getThemeDownloadBase(city.uf);

            if (response === 200) {
              city.status = "SUCCESS"; 
            } else {
              city.status = "ERROR"; 
              failedMunicipalities.value.push(city.nameCity);
            }
          } catch (error) {
            city.status = "ERROR"; 
            failedMunicipalities.value.push(city.nameCity);
            console.error(`Erro ao baixar para a cidade ${city.nameCity}:`, error);
          }

          await new Promise((resolve) => setTimeout(resolve, 500)); 
        }
      } catch (error) {
        console.error("Erro geral ao processar downloads:", error);
      }
    }

  } else {
    selectedMunicipalitiesStatus.value = citiesSelectedToSearch.value.map((city) => ({
      nameCity: city,
      uf: `${city}`,
      status: "LOADING",
    }));

    try {
      for (const city of selectedMunicipalitiesStatus.value) {
        try {
          const response = await getThemeDownloadBase(city.uf);

          if (response === 200) {
            city.status = "SUCCESS"; 
          } else {
            city.status = "ERROR"; 
            failedMunicipalities.value.push(city.nameCity);
          }
        } catch (error) {
          city.status = "ERROR"; 
          failedMunicipalities.value.push(city.nameCity);
          console.error(`Erro ao baixar para a cidade ${city.nameCity}:`, error);
        }

        await new Promise((resolve) => setTimeout(resolve, 10)); 
      }
    } catch (error) {
      console.error("Erro geral ao processar downloads:", error);
    }
  }
    
  return {
    citiesSelectedToSearch,
    selectedMunicipalitiesStatus,
    downloadAllBases,
  }
  
}

async function downloadStateBase(row) {

  if (!isCaptchaValidated.value) {
    warningToastId.value = toast.warn(i18n.global.t('themes.recaptchaWarn'))
    someoneWantsDownload.value = true
  } else {
    someoneWantsDownload.value = false
  }

  if (!isCaptchaValidated.value) {
    stateBaseBuffer.value.push(row)
    return;
  }

  if (warningToastId.value && isCaptchaValidated.value) {
    toast.update(warningToastId.value, {
      render: '',
      type: 'default',
      isLoading: false,
      autoClose: 10, 
    });
    warningToastId.value = null; 
  }
  
  if (stateBaseBuffer.value.length === 0) {

    downloadStates.value.map(e => {
      if(e.status === 'SUCCESS') {
        e.status = 'LOADING'
      }
    })
    
    downloadStates.value.push({ state: row, status: "LOADING" });

    const stateArray = federativeUnits.value.map(e => {
      if (e.name === row) {
        return e.id
      }
    })
    const state = stateArray.find(item => item !== undefined)

    await getThemeDownloadBase(state).then((response) => {
      if(response === 200) {
        downloadStates.value.map(element => { 
          element.status = 'SUCCESS'
        })
      } else {
        downloadStates.value.map(element => { 
          element.status = 'ERROR'
        })
      }
    })
  } else {
    
    downloadStates.value.map(e => {
      if(e.status === 'SUCCESS') {
        e.status = 'LOADING'
      }
    })
    
    downloadStates.value.push({ state: row, status: "LOADING" });

    const stateArray = federativeUnits.value.map(e => {
      if (e.name === row) {
        return e.id
      }
    })
    const state = stateArray.find(item => item !== undefined)

    await getThemeDownloadBase(state).then((response) => {
      if(response === 200) {
        downloadStates.value.map(element => { 
          element.status = 'SUCCESS'
        })
      } else {
        downloadStates.value.map(element => { 
          element.status = 'ERROR'
        })
      }
    })

  }
  
}

function getStateStatus(row) {
  const state = downloadStates.value.find((item) => item.nameCity === row.nameCity);
  return state ? state.status : "NOT_STARTED";
}

function getStatus(cityName) {
  const municipality = this.selectedMunicipalitiesStatus.find(
    (item) => item.nameCity === cityName
  );
  return municipality ? municipality.status : 'NOT_STARTED';
}

async function returnRefreshedDate() {
  
  const response = await getRefreshedDate();
  const dt = response.data
  refreshDate.value = dt

}

function formatCar() {

  registrationNumberCar.value = registrationNumberCar.value.toUpperCase()

  let cleanedValue = registrationNumberCar.value.replace(/[^A-Z0-9]/g, '').toUpperCase();

  if (cleanedValue.length > 41) {
    cleanedValue = cleanedValue.substring(0, 41);
  }
  if (cleanedValue.length <= 2) {
    registrationNumberCar.value = cleanedValue;
  } else if (cleanedValue.length <= 9) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}`;
  } else if (cleanedValue.length <= 13) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}`;
  } else if (cleanedValue.length <= 17) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}`;
  } else if (cleanedValue.length <= 21) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}`;
  } else if (cleanedValue.length <= 25) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}.${cleanedValue.substring(21, 25)}`;
  } else if (cleanedValue.length <= 29) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}.${cleanedValue.substring(21, 25)}.${cleanedValue.substring(25, 29)}`;
  } else if (cleanedValue.length <= 33) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}.${cleanedValue.substring(21, 25)}.${cleanedValue.substring(25, 29)}.${cleanedValue.substring(29, 33)}`;
  } else if (cleanedValue.length <= 37) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}.${cleanedValue.substring(21, 25)}.${cleanedValue.substring(25, 29)}.${cleanedValue.substring(29, 33)}.${cleanedValue.substring(33, 37)}`;
  } else if (cleanedValue.length <= 41) {
    registrationNumberCar.value = `${cleanedValue.substring(0, 2)}-${cleanedValue.substring(2, 9)}-${cleanedValue.substring(9, 13)}.${cleanedValue.substring(13, 17)}.${cleanedValue.substring(17, 21)}.${cleanedValue.substring(21, 25)}.${cleanedValue.substring(25, 29)}.${cleanedValue.substring(29, 33)}.${cleanedValue.substring(33, 37)}.${cleanedValue.substring(37, 41)}`;
  }
}

async function handleSearch() {

  returnRefreshedDate();
  obtainedData.value = true
 
  if (!registrationNumberCar.value && !ufCurrent.value && !cityCurrent.value) return

  downloadStates.value = [];
  loading.value = true
  try {
    if (registrationNumberCar.value !== null && registrationNumberCar.value.trim() !== '') {
      const { data } = await getDeatilsByIdentifier(registrationNumberCar.value);
      if (data) {
        infosCar.value = data;
        mapData.value.filters = mountMapFilters()
      } else {
        toast.warning(i18n.global.t("messageToast.warning.carNotFound"));
      }
    } else if (ufCurrent.value !== null) {
      infosCar.value = null
      getAllTotalizers(ufCurrent.value, cityCurrent.value || [])
      const objectFiltro = {
        ufCurrent: ufCurrent.value,
        cityCurrent: cityCurrent.value
      }

      const stateSelected = federativeUnits.value.find(state => state.id === ufCurrent.value)
      const nameState = stateSelected ? stateSelected.name : null;
      ufSelectedToSearch.value = nameState
      citiesSelectedToSearch.value = cityCurrent.value
      setLocalStorageWithExpiry("MainPageFilter", objectFiltro, 3600)
      mapData.value.filters = mountMapFilters()
    }
  } catch {
    toast.error(i18n.global.t("messageToast.error.searchCar"));
    mapData.value.filters = null
  } finally {
    loading.value = false
  }

  selectedMunicipalitiesStatus.value = citiesSelectedToSearch.value?.map((city) => {
    return {
      nameCity: city,
      uf:  `${city}`,
      status: "NOT_STARTED"
    }
  })
}

async function getAllUfs() {
  const response = await getUf()
  const recievingUfs = response.data

  const sortedResponse = recievingUfs.sort((currentFederativeUnit, nextFederativeUnit) => {
    if(currentFederativeUnit.name.toLowerCase() < nextFederativeUnit.name.toLowerCase()) {
      return -1;
    }

    if(currentFederativeUnit.name.toLowerCase() > nextFederativeUnit.name.toLowerCase()) {
      return 1;
    }

    return 0;
  }) 
  
  federativeUnits.value = sortedResponse
}

async function getCityByUf(ufCurrent) {
  const response = await getCitiesByUf(ufCurrent)
  const recievingMunicipalities = response.data
  const sortedResponse = recievingMunicipalities.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); 
  cities.value = sortedResponse
}

async function getAllTotalizers(ufCurrent, cityCurrent) {

  const cityIds = []

  if (cityCurrent) {
    cityIds.value = cities.value.filter(e => cityCurrent.includes(e.name)).map(e => e.id);
  }

  const response = {};

  if (ufCurrent) {
    response.value = await getTotalizers(ufCurrent, cityIds.value);
  } else {
    response.value = await getTotalizers(null, []);
  }

  allTotalizers.value = response.value?.data || [];

  allTotalizers.value.forEach(element => {
    if (element.subItemValue === 0) {
      element.subItemValue = '';
      element.subItemName = '';
    }
  });
}

const handleSelectedStateChange = (newValue) => {
  cityCurrent.value = ''
  ufCurrent.value = newValue
}

async function getThemeDownloadBase(territory) {

  try {
    const response = await getDownloadBaseFromS3(`CURRENT_BASE_GEO/${territory}.gpkg`);
    const url = response.data;

    if(response.status === 200) {
      
      const fileLink = document.createElement('a');
      fileLink.href = url;
      // fileLink.target = '_blank';
      fileLink.setAttribute('download', url);
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
      URL.revokeObjectURL(url);
      
      return 200;
    } else {
      throw new Error();
    }

  } catch (error) {
    console.error('Erro ao tentar baixar o arquivo:', error);
  } 
}

function clear() {
  obtainedData.value = false
  ufCurrent.value = null
  cityCurrent.value = null
  ufSelectedToSearch.value = null
  citiesSelectedToSearch.value = null
  registrationNumberCar.value = ''
  const objectFiltro = {
    ufCurrent: ufCurrent.value,
    cityCurrent: cityCurrent.value
  }
  setLocalStorageWithExpiry("MainPageFilter", objectFiltro, 3600)
  getAllTotalizers()

  resetMap()
}

const resetMap = () => {
  mapData.value.filters = null
  eventBus.clickedCAR = null
  mapData.value.showSkeleton = true

  setTimeout(() => {
    mapData.value.showSkeleton = false
  }, 100)
}

const amountOfselectedMunicipalities = computed(() => {
  return cityCurrent.value.length > 1 ? true : false;
})

const showDetailSearch = computed(() => {
  return (ufSelectedToSearch.value || (citiesSelectedToSearch.value && citiesSelectedToSearch.value.length)) && !registrationNumberCar.value && ufCurrent.value;
});

const showDetailSearchByCar = computed(() => {
  return registrationNumberCar?.value && infosCar.value;
});

const checkNeedAuthenticateSeeDetails = computed(() => {
  return accessManager.value?.searchDetails ? isAuthenticated.value : true
})

const showMap = computed(() => {
  return accessManager.value?.mapComponent ? isAuthenticated.value : true
})

const showClear = computed(() => {
  return ufCurrent.value || registrationNumberCar?.value
})

const mountMapFilters = () => {
  return {
    uf: federativeUnits.value?.find(ufs => ufs.id === ufCurrent.value),
    cities: cities.value?.filter(city => cityCurrent.value?.includes(city.name)),
    car: infosCar.value
  }
}

watch(ufCurrent, async (newValue) => {
  if (newValue) {
    registrationNumberCar.value = null;
    objectufCurrent.value = federativeUnits.value.find(ufs => ufs.id === ufCurrent.value);
    const response = await getCityByUf(ufCurrent.value)
    cities.value = response.data
  } else {
    cities.value =  null
    clear()
    getAllTotalizers()
    resetMap()
  }
})

watch(registrationNumberCar, (newValue) => {

  if (newValue) {
    ufCurrent.value = null;
    cityCurrent.value = null;
  }
});

watch(eventBus, (val) => {
  if(val?.clickedCAR) {
    const { clickedCAR } = val

    registrationNumberCar.value = clickedCAR.codeProperty
    infosCar.value = clickedCAR
  }
})
</script>

<style scoped>
#loading-file {
  color: #1351B4;
  width: 30px;
  margin-right: 8%;
}

#subtitle-menu {
  margin-top: 10px;
  padding-left: 20px;
}

.table-container {
  margin-top: 40px;
}

.banner-container {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  padding-bottom: 24px;
}

.project-name {
  font-size: 60px;
}

.br-map {
  background: #F9F2D2 0% 0% no-repeat padding-box;

  img {
    margin-left: 201px;
    width: 200px;
    margin-right: 54px;
  }

}

.data-obtained-container {
  padding-top: 20px;
}

.banner-content {
  background-image: url('../assets/banner-novo-consulta-publica-1.png');
  background-size: contain;
  color: #42916E;
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  gap: 7px;

  h1 {
    font-size: 40px;
    font-weight: 200;
  }

  h2 {
    font-size: 24px;
    font-weight: 100;
  }

}

.banner-container button {
  width: 134px;
  height: 40px;
  margin-top: 16.5px;
  font-weight: 500;
}

.error-download {
  display: flex;
  gap: 20px;
  justify-content: end;
  align-items: end;
}

.filter-container-margin {
  margin-inline: 26px;
  padding-top: 16px;
  padding-bottom: 16px;
}

.el-menu-vertical {
  border: 1px solid #70707045;
  margin-top: 20px;
  padding-top: 2px;
  padding: 15px;
}

.el-menu-vertical-by-car {
  border: 1px solid #70707045;
  margin-top: 20px;
  padding: 15px;
}

.title-menu {
  font-size: 20px;
  color: #42916e;
  font-weight: 600;
  text-transform: uppercase;
}

.content-el-menu-byCar {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
}

.content-el-menu {
  padding: 20px;
}

.search-info {
  font-size: 20px;
}

.state-text {
  margin-top: 25px;
  margin-bottom: 10px;
  color: #707070;
  font-size: 17px;
}

.uf-text {
  color: #707070;
  font-size: 18px;
  font-weight: 600;
}

.content-general {
  width: 92%;
}

.recaptcha-container {
  padding-top: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-page-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.filter-container {
  width: 100%;
  background: #F2F2F2;
  margin-bottom: 25px;

  h3 {
    font-size: 22px;
    margin-bottom: 15px;
    margin-top: 15px;
    color: #333;
  }
}

.filter-fields-container {
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 22px;
}

.select-uf {
  width: 13%;
  min-width: 100px;
}

.select-cities {
  min-width: 300px;
  width: 40%;
}

.number-car {
  width: 25%;
  min-width: 300px;
}

.btn-container {
  margin-top: 16px;
}

.btns-container {
  display: flex;
  justify-content: start;
  gap: 19px;
  min-width: 200px;
}

.filter-btn-container {
  margin-top: 25px;
  margin-left: 35px;

  a {
    color: #1351B4;
    font-size: 16.8px;
    font-weight: 600;
  }

}

.data-cards {
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: 26px;
}

.data-card-container {
  width: 20%;
  padding: 17px 0;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;

}

.data-card-margin {
  display: flex;
  flex-direction: row;
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

.details-and-data-accesss {
  border: 1px solid #70707045;
  border-radius: 4px;

  .search-details {
    padding-top: 16px;
  }

  .state-info {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    #state-name {
      font-weight: 600;
    }
  }

  .access-login {
    width: 50%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #F6FBF1 0% 0% no-repeat padding-box;
  }

  h6 {
    font-size: 16.8px;
    color: #42916E;
  }

  p {
    font-size: 17px;
    font-weight: 100;
  }
}

.details-data-access-margin {
  margin-inline: 24px;
  padding: 24px 0;
}

.you-search {
  p {
    margin-top: 30px;
  }

}

.toogle-menu {
  display: grid;
  grid-template-columns: 40% 40%;
  justify-content: space-between;

  h6 {
    font-size: 22px;
  }
}

.toogle-menu a {
  grid-column: 3;
}

.toogle-menu img {
  width: 40px;
}

.clicked {
  transform: rotate(180deg);
}

.title-checkRegistered {
  font-size: 20px;
}

.el-column-themes {
  margin-left: 40px;
}

.el-column-download {
  color: #1351B4;
  font-size: 18px;
  cursor: pointer;
}

.column-download-all {
  width: 120px;
  padding: 15px 22%;
}

@media screen and (max-width: 950px) {

  .banner-container {
    flex-direction: column;
  }

  .data-cards {
    flex-direction: column;
  }

  .data-card-container {
    width: 100%;
  }

  .br-map {
    background: #F9F2D2 0% 0% no-repeat padding-box;

    img {
      display: none;
    }
  }

  .el-column-themes {
    margin-left: 0px;
  }

  .el-column-download {
    margin-right: 0px;
  }

  .el-column-download-header {
    margin-right: 0px;
  }
}
</style>
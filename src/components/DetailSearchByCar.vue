<template>
  <div class="details-and-data-access">
    <div class="header-detail">
      <div class="flag">
        <img :src="flagState" alt="Flag" class="flag-icon" />
      </div>
      <el-col :xs="24" :sm="22">
        <el-row :gutter="20">
          <el-col class="align" :xs="24" :sm="12" :md="14">
            <p>{{ $t('label.registrationNumber') }}</p>
            <strong>{{ infosCar?.codeProperty ? infosCar.codeProperty : '-' }}</strong>
          </el-col>
          <el-col class="align" :xs="24" :sm="12" :md="5">
            <p>{{ $t('label.registrationDate') }}</p>
            <strong>{{ infosCar?.createdAt ? infosCar?.createdAt : '-' }}</strong>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <p>{{ $t('label.lastCorrection') }}</p>
            <strong>{{ infosCar?.lastRectification ? infosCar?.lastRectification : '-' }}</strong>
          </el-col>
        </el-row>
      </el-col>
    </div>
    <el-divider />
    <div class="title">
      <span>{{ $t('property.ruralPropertyData') }}</span>
    </div>
    <div class="detail-car-content">
      <el-row class="margin-el-row">
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.municipality') }}</p>
          <strong>{{ infosCar?.nameCity ? infosCar.nameCity : '-' }}</strong>
        </el-col>
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.federationUnit') }}</p>
          <strong> {{ infosCar?.nameState ? infosCar.nameState : '-' }} </strong>
        </el-col>
      </el-row>
      <el-row class="margin-el-row">
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.latitude') }}</p>
          <strong>{{ infosCar?.latitude ? infosCar.latitude : '-' }}</strong>
        </el-col>
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.longitude') }}</p>
          <strong>{{ infosCar?.longitude ? infosCar.longitude : '-' }}</strong>
        </el-col>
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('label.centroidCoordinates') }}</p>
          <strong>{{ infosCar?.geographicCoordinatesOfCentroid ? infosCar.geographicCoordinatesOfCentroid : '-'
            }}</strong>
        </el-col>
      </el-row>
      <el-row class="margin-el-row">
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.propertyArea') }}</p>
          <strong>{{ infosCar?.haRegisteredArea ? infosCar.haRegisteredArea : '-' }}</strong>
        </el-col>
        <el-col class="align" :xs="24" :sm="12" :md="5">
          <p>{{ $t('property.taxModules') }}</p>
          <strong>{{ infosCar?.fiscalModules ? infosCar.fiscalModules : '-' }}</strong>
        </el-col>
      </el-row>
    </div>
    <div class="buttons">
      <el-button @click="downloadStatement()" type="primary">{{ $t('property.downloadStatement') }}</el-button>
      <el-button @click="downloadFeatures()" class="invertedColorButton">{{ $t('property.downloadFeatures')
        }}</el-button>
    </div>
    <div class="recap-from-detail">
      <vue-recaptcha v-if="someoneWantsDownload" sitekey="6Lc3Z-UqAAAAADr2u80W2XVfEZ6VfkxXATAxE52c" size="normal"
        theme="light" hl="pt-br" @verify="recaptchaVerified" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { addFlagToState } from '../constants/regions';
import { getShapeByIdOrigin } from '../services/dataStateCitiesTotalizers.js'
import { i18n } from '../main.js';
import { toast } from 'vue3-toastify';
import { validateRecaptcha } from '../services/recaptchaService.js';

const flagState = ref('');
const someoneWantsDownload = ref(false)
const isCaptchaValidated = ref(false)
const warningToastId = ref(false)
const featureDownloadBuffer = ref(null)
const emit = defineEmits(['recaptcha-verified', 'download-requested']);

const props = defineProps({
  infosCar: {
    type: Object,
  }
})

onMounted(() => {
  addflag();
});

function addflag() {
  if (props.infosCar) {
    flagState.value = addFlagToState(props.infosCar.idState);
  }
}

async function recaptchaVerified(response) {

  const result = await validateRecaptcha(response)

  if (result.status === 200) {
    isCaptchaValidated.value = true
  }

  if (featureDownloadBuffer.value) {
    emit('recaptcha-verified')
    downloadFeatures(featureDownloadBuffer.value)
  }

}

async function downloadFeatures() {
  emit('download-requested')

  if (!isCaptchaValidated.value) {
    warningToastId.value = toast.warn(i18n.global.t('themes.recaptchaWarn'))
    emit('download-requested')
    someoneWantsDownload.value = true
  } else {
    someoneWantsDownload.value = false
  }

  if (!isCaptchaValidated.value) {
    featureDownloadBuffer.value = props.infosCar.idOrigin
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

  let url = null

  try {
    const blob = await getShapeByIdOrigin(props.infosCar.idOrigin)
    url = window.URL.createObjectURL(blob.data)

    const fileLink = document.createElement('a');

    fileLink.href = url;
    fileLink.download = `${props.infosCar?.codeProperty}_${i18n.global.t('themes.features')}.zip`;

    document.body.appendChild(fileLink);

    fileLink.click();
    document.body.removeChild(fileLink)

    return blob
  } catch {
    toast.error(i18n.global.t('messageToast.error.download'))
  } finally {
    if (url) {
      window.URL.revokeObjectURL(url);
    }
  }
}

function downloadStatement() {
  window.open(`https://www.car.gov.br/#/consultar/${props.infosCar.codeProperty}`, '_blank');
}

watch(props.infosCar, () => {
  addflag()
})
</script>

<style scoped>

.recap-from-detail {
  padding-top: 40px;
  padding-left: 5px;
}

.details-and-data-access {
  border-radius: 8px;
}

h6 {
  font-size: 20px;
  color: #42916e;
  font-weight: 600;
  text-transform: uppercase;
}

.header-detail {
  display: flex;
  gap: 20px;
  margin-top: 12px;
}

.flag-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flag-icon {
  width: 60px;
}

strong {
  color: #707070;
  font-size: 17px;
}

.flag {
  width: 50px;
}

p {
  margin-bottom: 7px;
  color: #707070;
  font-size: 15px;
}

.align {
  margin-bottom: 0px;
}

.title {
  font-size: 20px;
  color: #707070;
}

.title {
  margin-bottom: 20px;
  margin-bottom: 20px;
}

.margin-el-row {
  margin-bottom: 30px;
}

.buttons {
  width: 50%;
  display: flex;
  gap: 25px;
}

.buttons>*:nth-child(2) {
  width: 180px;
}

.buttons>*:first-child {
  width: 250px;
}

@media screen and (max-width: 900px) {
  .header-detail {
    flex-direction: column;
  }

  .align {
    margin-bottom: 20px;
  }

  .margin-el-row {
    margin-bottom: 0px;
  }

  .buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
  }

  .buttons>*:first-child {
    width: 50%;
    font-size: 13px;
  }

  .buttons>*:nth-child(2) {
    width: 50%;
    font-size: 13px;
  }
}
</style>
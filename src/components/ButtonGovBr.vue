<template>
  <el-button
    type="primary"
    class="login-button-gov"
    :class="{ 'backgroundGray': bcGray }"
    @click="logar"
  >
    <template v-if="withIcon">
      <font-awesome-icon :icon="['fas', 'user']" class="login-icon" />
      <strong>{{ $t("button.enter") }}</strong>
    </template>
    <template v-else>
      <span>{{ $t("button.enterWith") }}</span>
      <strong>gov.br</strong>
    </template>
  </el-button>
</template>

<script setup>
import { logarGovBr } from "../services/govBr";

async function logar() {
  const res = await logarGovBr();
  window.location.href = res.data;
}

defineProps({
  withIcon: {
    type: Boolean
  },
  bcGray: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.login-button-gov {
  width: 100%;
  height: 100%;
  font-size: 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-icon {
  margin-right: 1px;
  padding-bottom: 5px;
}

strong {
  margin-left: 5px;
}
</style>

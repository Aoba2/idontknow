<template>
  <div>
    <div :class="{ 'header-container-mobile': isMobile }" class="header-container">
      <div class="branding-section">
        <img src="../assets/govbr.svg" alt="Logomarca do Govbr" id="govbr" />
        <h1>Novo Consulta Pública</h1>
        <h2>{{ $t("header.ministry") }}</h2>
      </div>

      <div class="nav-menu" :class="{ 'hidden': isMobile }">
        <ul>
          <li>
            <router-link to="/">{{ $t("pages.home") }}</router-link>
          </li>
          <li>
            <router-link to="/geoservices">{{ $t("pages.geoservices") }}</router-link>
          </li>
          <!-- <li>
            <router-link to="/dynamic-report">{{ $t("pages.dynamicReports") }}</router-link>
          </li>
          <li>
            <router-link to="/car-observatory">{{ $t("pages.observatory") }}</router-link>
          </li> -->
          <li>
            <router-link to="/about">{{ $t("pages.about") }}</router-link>
          </li>
        </ul>
        <!-- <span>|</span> -->
        <!-- <i v-if="false" class="fa-solid fa-magnifying-glass"
          :style="{ color: '#1351B4', width: '20px', height: '16px', marginRight: '30px' }"></i> -->
      </div>
      <div :class="{ 'align-button': isMobile, 'aling-button-web': !isMobile }">
        <el-dropdown class="menu-toggle">
          <span class="el-dropdown-link">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/" class="mobile-link"><el-dropdown-item>{{ $t("pages.home") }}</el-dropdown-item></router-link>
              <router-link to="/geoservices" class="mobile-link"><el-dropdown-item>{{ $t("pages.geoservices")}}</el-dropdown-item></router-link>
              <!-- <el-dropdown-item><router-link to="/dynamic-report">{{ $t("pages.dynamicReports")
                  }}</router-link></el-dropdown-item>
              <el-dropdown-item><router-link to="/car-observatory">{{ $t("pages.observatory")
                  }}</router-link></el-dropdown-item> -->
                  <router-link to="/about" class="mobile-link"><el-dropdown-item>{{ $t("pages.about")
                  }}</el-dropdown-item> </router-link>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <div v-if="!user" class="login-container">
          <ButtonGovBr :withIcon="true" :bcGray="true" />
        </div>
        <div v-else class="login-container">
          <el-tooltip class="box-item" effect="dark" :content="$t('message.hello') + user?.name + '!'"
            placement="bottom">
            <i class="fa-solid fa-user" :style="{ color: '#1351B4', width: '20px', height: '16px' }"></i>
          </el-tooltip>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
// import ButtonGovBr from "./ButtonGovBr.vue";
import { useStore } from "vuex";

const store = useStore();
// const user = computed(() => store.state.user);
const isMobile = ref(window.innerWidth <= 950);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 950;
};

onMounted(() => {
  store.dispatch("loadUser");
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>

.mobile-link {
  text-decoration: none;
}

.header-container {
  background: #ffffff;
  box-shadow: 0px 1px 6px #00000029;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  padding: 10px;
}

.branding-section { 
  padding-left: 3vw;
}

.header-container-mobile {
  box-shadow: 0px 1px 6px #00000029;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  padding: 10px;
}

#govbr {
  width: 46px;
  height: 15px;
  padding-top: 12px;
  padding-bottom: 9px;
}

.login-container {
  margin-right: 3vw;
}

.align-button {
  justify-self: end;
  padding-right: 4vw;
}

h1 {
  text-align: left;
  font-size: 24.16px;
  font-weight: 100;
  color: #000000;
}

h2 {
  font-weight: 100;
  font-size: 18px;
  color: #555555;
  padding-bottom: 13px;
}

.nav-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.nav-menu ul {
  display: flex;
  flex-direction: row;
  padding-right: 24px;
  gap: 24px;
}

.nav-menu a {
  color: #1351b4;
  font-weight: 600;
  font-size: 14.67px;
  cursor: pointer;
}

.nav-menu span {
  color: transparent;
  border-left: 3px solid #ccc;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 7px;
}

.menu-toggle {
  display: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
}

@media screen and (max-width: 950px) {
  .header-container {
    flex-direction: column;
    align-items: center;
  }

  .nav-menu {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .nav-menu ul {
    flex-direction: column;
    padding: 0;
    gap: 10px;
    text-align: center;
  }

  .menu-toggle {
    display: block;
  }

  .hidden {
    display: none;
  }
}
</style>

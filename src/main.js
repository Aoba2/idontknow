import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "@fortawesome/fontawesome-free/css/all.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createI18n } from "vue-i18n";
import PtBr from "./locale/ptBr.json";
import store from "./store/user.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "vue3-toastify/dist/index.css";
import "./style.css";
import Vue3Toastify from 'vue3-toastify';
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/styles/el-button.css";
import "./assets/styles/el-dropdown.css";
import "./assets/styles/el-switch.css";
import "./assets/styles/el-table.css";
import "./assets/styles/el-menu.css";
import "./assets/styles/Customleaflet.css";
import vueRecaptcha from 'vue3-recaptcha2';
// import RecaptchaV2 from "vue3-recaptcha2"

export const i18n = createI18n({
  legacy: false,
  locale: "ptBr",
  messages: {
    ptBr: PtBr,
  },
});

library.add(fas, fab, far);

createApp(App)
  .use(router)
  .use(i18n)
  .use(ElementPlus)
  .use(store)
  // .component("vue-hcaptcha", VueHcaptcha)
  .component("vue-recaptcha", vueRecaptcha)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(Vue3Toastify, {
    autoClose: false, 
  }).mount("#app");

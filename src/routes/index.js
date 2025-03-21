import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import DynamicReport from "@/views/DynamicReport.vue";
import Geoservices from "@/views/Geoservices.vue";
import About from "@/views/About.vue";
import PerformGovBrLogin from "@/views/PerformGovBrLogin.vue";
import ObserverCar from "../views/ObserverCar.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: MainPage },
    { path: "/geoservices", component: Geoservices, name: "geoservices" },
    { path: "/car-observatory", component: ObserverCar },
    { path: "/dynamic-report", component: DynamicReport },
    { path: "/about", component: About },
    { path: "/redirect/govbr", component: PerformGovBrLogin },
  ],
});

export default router;

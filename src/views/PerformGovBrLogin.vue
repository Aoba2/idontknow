<template>
  <div v-loading.fullscreen.lock="true" ></div>
</template>

<script setup>
import { ref, onMounted} from "vue";
import { useRoute } from "vue-router";
import { effectLogin, getUserGov } from "../services/govBr";
import { setCookie, setLocalStorageWithExpiry } from "../utils/utils.js"
import { toast } from "vue3-toastify";
import { i18n } from "../main.js";
import { useRouter } from "vue-router";
import dataUser from "../store/user.js"

const isLoading = ref(true);
const route = useRoute();
const router = useRouter()

onMounted(async () => {
  try {
    const code = route.query.code;
    const response = await effectLogin(code, "publicar");
    setCookie("token", response.data.access_token, 3600);

    const user = await getUserGov(response.data.id_token)

    const obj = {
      cpfCnpj: user.data.login,
      name: user.data.name,
      email: user.data.email,
      login: user.data.login
    };

    setLocalStorageWithExpiry("userPublicar", obj, 3600)

    isLoading.value = false;

    router.push('/').then(() => {
      dataUser.dispatch("loadUser");
      toast.success(i18n.global.t('messageToast.success.fullyLogged'))
    });

  } catch {
    router.push('/').then(() => {
      toast.error(i18n.global.t('messageToast.error.logged'))
    });
  }
});
</script>

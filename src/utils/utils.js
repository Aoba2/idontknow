import { toast } from "vue3-toastify";
import { i18n } from "../main";

export const setCookie = (name, value, expirationInSeconds) => {
  const date = new Date();
  date.setTime(date.getTime() + expirationInSeconds * 1000);
  const expires = "expires=" + date.toUTCString();
  const secure = window.location.protocol === "https:" ? "Secure" : "";
  document.cookie = `${name}=${value}; ${expires}; path=/; ${secure}`;
};

export const formatValue = (number) => {

  if (Number.isInteger(number)) {
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export const formatValueInt = (number) => {
  const numeroFormatado = number.toLocaleString("pt-BR");

  return numeroFormatado;
};

export const setLocalStorageWithExpiry = (key, object, time) => {
  const data = {
    value: object,
    expiry: new Date().getTime() + time * 1000,
  };
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorageWithExpiry = (key) => {
  const data = JSON.parse(localStorage.getItem(key));

  if (!data) return null;

  if (new Date().getTime() > data.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return data.value;
};

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const copyToClipboard = async (text, type) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(type + i18n.global.t("messageToast.success.copy"));
  } catch {
    toast.error(i18n.global.t("messageToast.error.copy") + type);
  }
};

import axios from "axios";

export const host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const validateRecaptcha = (response) => {
  return host.post("hcaptcha/validate", {
    token: response
  });
};


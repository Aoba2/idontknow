import axios from "axios";

export const localhost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const logarGovBr = () => {
  return localhost.get(`redirect/loginGovBr`);
};

export const effectLogin = (code, host) => {
  return localhost.get(`redirect/govbr`, {
    params: { code, host },
  });
};

export const getUserGov = (code) => {
  return localhost.get(`redirect/getUserGov`, {
    params: { code },
  });
};

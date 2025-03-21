import axios from "axios";

export const localhost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAcessManager = () => {
  return localhost.get(`accessManager/privateAccess`);
};

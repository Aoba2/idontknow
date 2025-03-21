import axios from "axios";

export const localhost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getRefreshedDate = () => {
  return localhost.get("date/getRefreshedDate");
};


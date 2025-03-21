import axios from "axios";

export const localhost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getLayers = () => {
  return localhost.get("map/getLayers");
};

export const getBaseMaps = () => {
  return localhost.get("map/getBaseMaps");
};

export const getGeoServerLayerLink = async (uf, city, themes) => {
  const data = { uf, city, themes };

  return await localhost.post("geoServices/getGeoServerLayerLink", data);
};

export const getAllThemesByLayersConfig = async () => {
  return localhost.get("geoServices/getGeoServerLayerNames");
};

export const getDownload = async (link, typeFile) => {
  return await localhost.post(
    `geoServices/getImageGeoservice/${typeFile}`,
    link,
    {
      responseType: "blob",
    }
  );
};

import axios from "axios";

export const host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getUf = () => {
  return host.get("state/getAll");
};

export const getRegionsWithStates = () => {
  return host.get(`geoServices/getRegions`);
};

export const getCitiesByUf = (uf) => {
  return host.get(`state/getCitiesByUf/${uf}`);
};

export const getTotalizers = (ufId, cityId) => {
  const obj = {
    idState: ufId,
    idsCities: cityId,
  };

  return host.post("totalizer/getTotalizerByStateOrCity", obj);
};

export const getEnvironmentalTheme = () => {
  return host.get("environmental-theme/findAll");
};

export const getDownloadBase = (codeUf, type) => {
  return host.get(`downloadBase/${codeUf}/${type}`, {
    responseType: "blob",
  });
};

export const getDownloadBaseFromS3 = (fileName) => {
  return host.get(`/downloadBase/get-url-file-s3`, {
    params: {
      fileName: fileName,
    },
  });
};

export const getDeatilsByIdentifier = (identifier) => {
  return host.get(`totalizer/getDeatilsByIdentifier/${identifier}`);
};

export const getDetailsByCoordinates = ({ lat, lng }) => {
  return host.get(`totalizer/getDetailsByCoordinates?lat=${lat}&lng=${lng}`)
}

export const getShapeByIdOrigin = (IdOrigin) => {
  return host.get(`downloadBase/getShapeByIdOrigin/${IdOrigin}`, {
    responseType: "blob",
  });
};

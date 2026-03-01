import api from "./axios";

export const getPortfolio = async () => {
  const res = await api.get("/api/portfolio");
  return res.data;
};

export const getAssetById = async (id) => {
  const res = await api.get(`/api/portfolio/${id}`);
  return res.data;
};
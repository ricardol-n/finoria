import api from "./axios";

export const getPortfolio = async () => {
  const res = await api.get("/portfolio");
  return res.data;
};

export const getAssetById = async (id) => {
  const res = await api.get(`/portfolio/${id}`);
  return res.data;
};
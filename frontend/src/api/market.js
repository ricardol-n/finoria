import api from "./axios";

export const getCryptoMarket = async () => {
  const res = await api.get("/market/crypto");
  return res.data;
}

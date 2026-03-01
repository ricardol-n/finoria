import api from "./axios";

export const getCryptoMarket = async () => {
  const res = await api.get("/api/market/crypto");
  return res.data;
}

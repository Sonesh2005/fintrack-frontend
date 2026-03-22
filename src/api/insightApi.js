import api from "./axios";

export const getInsights = async () => {
  const response = await api.get("/api/insights");
  return response.data;
};
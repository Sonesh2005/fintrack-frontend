import api from "./axios";

export const getBudget = async () => {
  const response = await api.get("/api/budget");
  return response.data;
};

export const saveBudget = async (payload) => {
  const response = await api.post("/api/budget", payload);
  return response.data;
};

export const getBudgetAlerts = async () => {
  const response = await api.get("/api/budget/alerts");
  return response.data;
};
import api from "./axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

export const getMonthlyAnalytics = async (year) => {
  const response = await api.get(`/api/dashboard/monthly?year=${year}`);
  return response.data;
};

export const getCategoryExpense = async () => {
  const response = await api.get("/api/dashboard/category-expense");
  return response.data;
};

export const getHealthScore = async (year, month) => {
  const response = await api.get(`/api/health/monthly?year=${year}&month=${month}`);
  return response.data;
};

export const getBudgetAlert = async () => {
  const response = await api.get("/api/budget/alerts");
  return response.data;
};

export const getHeatmapData = async (year, month) => {
  const response = await api.get(`/api/analytics/heatmap?year=${year}&month=${month}`);
  return response.data;
};

export const getInsights = async (year, month) => {
  const response = await api.get(`/api/analytics/insights?year=${year}&month=${month}`);
  return response.data;
};
import api from "./axios";

export const getIncomes = async () => {
  const response = await api.get("/api/incomes");
  return response.data;
};

export const getTotalIncome = async () => {
  const response = await api.get("/api/incomes/total");
  return response.data;
};

export const getMonthlyIncomeTotal = async (year, month) => {
  const response = await api.get(
    `/api/incomes/monthly-total?year=${year}&month=${month}`
  );
  return response.data;
};

export const createIncome = async (payload) => {
  const response = await api.post("/api/incomes", payload);
  return response.data;
};

export const updateIncome = async ({ id, payload }) => {
  const response = await api.put(`/api/incomes/${id}`, payload);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await api.delete(`/api/incomes/${id}`);
  return response.data;
};
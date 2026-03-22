import api from "./axios";

export const getExpenses = async () => {
  const response = await api.get("/api/expenses");
  return response.data;
};

export const getTotalExpenses = async () => {
  const response = await api.get("/api/expenses/total");
  return response.data;
};

export const getMonthlyExpenseTotal = async (year, month) => {
  const response = await api.get(
    `/api/expenses/monthly-total?year=${year}&month=${month}`
  );
  return response.data;
};

export const createExpense = async (payload) => {
  const response = await api.post("/api/expenses", payload);
  return response.data;
};

export const updateExpense = async ({ id, payload }) => {
  const response = await api.put(`/api/expenses/${id}`, payload);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/api/expenses/${id}`);
  return response.data;
};
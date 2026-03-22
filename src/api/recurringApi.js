import api from "./axios";

const BASE = "/api/recurring-expenses";

export const getRecurringItems = async () => {
  const response = await api.get(BASE);
  return response.data;
};

export const createRecurringItem = async (payload) => {
  const response = await api.post(BASE, payload);
  return response.data;
};

export const updateRecurringItem = async ({ id, payload }) => {
  const response = await api.put(`${BASE}/${id}`, payload);
  return response.data;
};

export const deleteRecurringItem = async (id) => {
  const response = await api.delete(`${BASE}/${id}`);
  return response.data;
};
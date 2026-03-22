import api from "./axios";

const BASE = "/api/goals";

export const getGoals = async () => {
  const response = await api.get(BASE);
  return response.data;
};

export const createGoal = async (payload) => {
  const response = await api.post(BASE, payload);
  return response.data;
};

export const updateGoal = async ({ id, payload }) => {
  const response = await api.put(`${BASE}/${id}`, payload);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`${BASE}/${id}`);
  return response.data;
};
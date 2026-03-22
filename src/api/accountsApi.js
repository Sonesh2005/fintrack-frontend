import api from "./axios";

const BASE = "/api/accounts";

export const getAccounts = async () => {
  const res = await api.get(BASE);
  return res.data;
};

export const createAccount = async (payload) => {
  const res = await api.post(BASE, payload);
  return res.data;
};

export const updateAccount = async ({ id, payload }) => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
};

export const deleteAccount = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};
export const transferMoney = async (payload) => {
  const res = await api.post("/api/accounts/transfer", payload);
  return res.data;
};
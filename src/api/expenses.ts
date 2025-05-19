import api from "./axiosInstance";

import { Expense, IQueryExpenses } from "../types";

export const createExpense = async (data: Omit<Expense, "id">) => {
  const res = await api.post<number>(`/expenses`, data);
  return res.data;
};

export const fetchExpenses = async ({
  fromDate,
  toDate,
  limit,
  offset,
}: IQueryExpenses) => {
  const res = await api.get<Expense[]>(`/expenses`, {
    params: {
      fromDate,
      toDate,
      limit,
      offset,
    },
  });
  return res.data;
};

export const fetchExpense = async (id: number) => {
  const res = await api.get<Expense>(`/expenses/${id}`);
  return res.data;
};

export const updateExpense = async (id: number, data: Partial<Expense>) => {
  const res = await api.patch(`/expenses/${id}`, data);
  return res.data;
};

export const deleteExpense = async (id: number) => {
  const res = await api.delete(`/expenses/${id}`);
  return res.data;
};

export const uploadInvoice = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/expenses/analyze-invoice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

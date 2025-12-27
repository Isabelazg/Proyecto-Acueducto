import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const api = {
  // People
  getPeople: (params) => apiClient.get('/people', { params }).then(res => res.data),
  createPerson: (data) => apiClient.post('/people', data).then(res => res.data),
  updatePerson: (id, data) => apiClient.patch(`/people/${id}`, data).then(res => res.data),

  // Periods
  getPeriodSummary: (period) => apiClient.get(`/periods/${period}/summary`).then(res => res.data),
  setFee: (period, data) => apiClient.put(`/periods/${period}/fee`, data).then(res => res.data),
  createPayment: (period, data) => apiClient.post(`/periods/${period}/payments`, data).then(res => res.data),
  deletePayment: (id) => apiClient.delete(`/periods/payments/${id}`).then(res => res.data),
  createExpense: (period, data) => apiClient.post(`/periods/${period}/expenses`, data).then(res => res.data),
  deleteExpense: (id) => apiClient.delete(`/periods/expenses/${id}`).then(res => res.data),
  createOtherIncome: (period, data) => apiClient.post(`/periods/${period}/other-incomes`, data).then(res => res.data),
  deleteOtherIncome: (id) => apiClient.delete(`/periods/other-incomes/${id}`).then(res => res.data),

  // Balance
  getBalance: () => apiClient.get('/balance').then(res => res.data),
};

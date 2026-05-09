import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getSubscriptions = async (params = {}) => {
  const response = await axios.get(`${API_BASE_URL}/subscriptions`, {
    headers: getAuthHeaders(),
    params,
  });

  return response.data;
};

export const getSubscriptionById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const createSubscription = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/subscriptions`, data, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateSubscription = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/subscriptions/${id}`, data, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const deleteSubscription = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/subscriptions/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getInsights = async () => {
  const response = await axios.get(`${API_BASE_URL}/subscriptions/insights`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

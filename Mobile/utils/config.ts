// config.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from "expo-secure-store";

const Token_key = "my-jwt";
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(Token_key);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('Request Config:', {
        url: `${API_URL}${config.url}`,
        method: config.method?.toUpperCase(),
        headers: config.headers,
      });
    } catch (error) {
      console.error('Error in request interceptor:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response Success:', {
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing auth state');
      await SecureStore.deleteItemAsync(Token_key);
      // You might want to redirect to login here
    }
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
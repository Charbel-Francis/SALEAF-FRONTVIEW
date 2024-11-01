// config.ts
import axios from 'axios';

export const API_URL = "https://saleafapi-production.up.railway.app";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
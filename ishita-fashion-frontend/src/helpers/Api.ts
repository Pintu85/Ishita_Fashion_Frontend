import axios from "axios";
import storage from "../utils/Storage"

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = storage.getToken(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


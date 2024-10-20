// src/axiosConfig.js
import axios from "axios";

// Buat instance axios dengan konfigurasi default
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ambil API URL dari file .env
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`, // Gunakan Access Token untuk Authorization
  },
  params: {
    api_key: import.meta.env.VITE_API_KEY, // Tambahkan API Key sebagai parameter default
  },
});

// Interceptor untuk request (opsional, jika ingin menambahkan logika sebelum request dikirim)
axiosInstance.interceptors.request.use(
  (config) => {
    // Kamu bisa menambahkan modifikasi di sini, misalnya loading state
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk response (opsional, jika ingin menangani error secara global)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tangani error global di sini
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Pastikan API URL ada di env
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Agar cookies bisa dikirim ke server jika diperlukan
});

// Tambahkan interceptor untuk menyisipkan token dari cookies
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(process.env.COOKIE_NAME as string); // Ambil token dari cookies
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface FetchingType<T = any> {
    id?: number;
    data?: T;
    user?: T;
    item?: T;
    status?: string;
    message?: string;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    custom?: AxiosRequestConfig;
}

export default api;

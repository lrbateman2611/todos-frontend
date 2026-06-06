import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// Token getter is set at runtime by the auth layer (see useAuthState.ts)
let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(getter: () => Promise<string | null>) {
  _getToken = getter;
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://localhost:5002",
});

// Intercept all requests to inject the Bearer token
instance.interceptors.request.use(
  async (config) => {
    if (_getToken) {
      try {
        const token = await _getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to get access token:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Export a function that uses the instance
export const axiosInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const { data } = await instance(config);
  return data;
};

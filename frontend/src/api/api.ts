import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && getRefreshToken() && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post("http://localhost:8080/api/auth/refresh", {
          refresh_token: getRefreshToken(),
        });
        setTokens(response.data.access_token, getRefreshToken()!);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
      } catch {
        clearTokens();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

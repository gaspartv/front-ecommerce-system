import axios from "axios";
import Cookies from "js-cookie";

// Base URL da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Configuração base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas e refresh token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o token expirou (401) e ainda não tentamos fazer refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Atualizar os cookies
          Cookies.set("token", token);
          Cookies.set("refreshToken", newRefreshToken);

          // Retry da requisição original com o novo token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch {
        // Se o refresh falhou, limpar cookies e redirecionar para login
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

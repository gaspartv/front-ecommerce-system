import { AxiosError } from "axios";

// Tipos para as respostas da API

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// Tipo genérico para respostas paginadas
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipo para AxiosError com ApiError
export type ApiAxiosError = AxiosError<ApiError>;

// Utilitário para verificar se um erro é do axios
export const isAxiosError = (error: unknown): error is ApiAxiosError => {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
};

import axios from "axios";

type Role = "admin" | "customer";

export interface ApiUser {
  id?: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  tag?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

// Automatically determine API base URL depending on environment.
// Keep this without "/api" so endpoint functions can use paths like "/api/auth/login".
export const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_DEVELOPMENT || "http://localhost:5000";

const api = axios.create({
  baseURL,
  timeout: 500000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("yp_auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("yp_auth_user");
      sessionStorage.removeItem("yp_auth_token");
      window.dispatchEvent(new Event("yp-auth-change"));
    }

    return Promise.reject(error);
  },
);

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<{ user: ApiUser }> => {
  const response = await api.get<{ user: ApiUser }>("/api/auth/me");
  return response.data;
};

export const seedDatabase = async (): Promise<unknown> => {
  const response = await api.post("/api/seed");
  return response.data;
};

export const healthCheck = async (): Promise<unknown> => {
  const response = await api.get("/api/health");
  return response.data;
};

export default api;

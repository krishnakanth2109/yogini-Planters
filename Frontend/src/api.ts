import axios from "axios";

type Role = "admin" | "customer";
type ApiErrorBody = {
  message?: string;
  code?: string;
};

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
  refreshToken?: string;
  expiresIn?: string;
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

    const apiError = error.response?.data as ApiErrorBody | undefined;
    if (apiError?.message) {
      return Promise.reject(new Error(apiError.code ? `${apiError.message} (${apiError.code})` : apiError.message));
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

export const getServices = async () => (await api.get("/api/services")).data;
export const getServiceBySlug = async (slug: string) => (await api.get(`/api/services/${slug}`)).data;
export const createService = async (data: unknown) => (await api.post("/api/services", data)).data;
export const updateService = async (id: string, data: unknown) => (await api.put(`/api/services/${id}`, data)).data;
export const deleteService = async (id: string) => (await api.delete(`/api/services/${id}`)).data;

export const createBooking = async (data: unknown) => (await api.post("/api/bookings", data)).data;
export const getMyBookings = async () => (await api.get("/api/bookings/my")).data;
export const cancelBooking = async (id: string, cancelReason?: string) =>
  (await api.patch(`/api/bookings/${id}/cancel`, { cancelReason })).data;
export const getAllBookings = async () => (await api.get("/api/bookings")).data;
export const updateBookingStatus = async (id: string, data: { status: string; amount?: number }) =>
  (await api.patch(`/api/bookings/${id}/status`, data)).data;

export const getMaintenancePlans = async () => (await api.get("/api/maintenance-plans")).data;
export const createMaintenancePlan = async (data: unknown) => (await api.post("/api/maintenance-plans", data)).data;
export const updateMaintenancePlan = async (id: string, data: unknown) =>
  (await api.put(`/api/maintenance-plans/${id}`, data)).data;
export const deleteMaintenancePlan = async (id: string) => (await api.delete(`/api/maintenance-plans/${id}`)).data;

export const createSubscription = async (data: unknown) => (await api.post("/api/subscriptions", data)).data;
export const getMySubscriptions = async () => (await api.get("/api/subscriptions/my")).data;
export const getAllSubscriptions = async () => (await api.get("/api/subscriptions")).data;
export const updateSubscriptionStatus = async (id: string, data: { status: string; notes?: string }) =>
  (await api.patch(`/api/subscriptions/${id}/status`, data)).data;
export const renewSubscription = async (id: string, months = 6) =>
  (await api.patch(`/api/subscriptions/${id}/renew`, { months })).data;

export const createWellnessTicket = async (data: unknown) => (await api.post("/api/wellness-tickets", data)).data;
export const getMyWellnessTickets = async () => (await api.get("/api/wellness-tickets/my")).data;
export const getAllWellnessTickets = async () => (await api.get("/api/wellness-tickets")).data;
export const diagnoseWellnessTicket = async (id: string, diagnosis: string) =>
  (await api.patch(`/api/wellness-tickets/${id}/diagnose`, { diagnosis })).data;
export const resolveWellnessTicket = async (id: string) =>
  (await api.patch(`/api/wellness-tickets/${id}/resolve`)).data;

export const getLibraryArticles = async () => (await api.get("/api/library")).data;
export const getLibraryArticleBySlug = async (slug: string) => (await api.get(`/api/library/${slug}`)).data;
export const createLibraryArticle = async (data: unknown) => (await api.post("/api/library", data)).data;
export const updateLibraryArticle = async (id: string, data: unknown) => (await api.put(`/api/library/${id}`, data)).data;
export const deleteLibraryArticle = async (id: string) => (await api.delete(`/api/library/${id}`)).data;

export const getWishlist = async () => (await api.get("/api/wishlist")).data;
export const addWishlistItem = async (serviceId: string) => (await api.post("/api/wishlist", { serviceId })).data;
export const removeWishlistItem = async (serviceId: string) => (await api.delete(`/api/wishlist/${serviceId}`)).data;

export const createReview = async (data: { rating: number; text: string }) => (await api.post("/api/reviews", data)).data;
export const getMyReviews = async () => (await api.get("/api/reviews/my")).data;
export const getPublicReviews = async () => (await api.get("/api/reviews/public")).data;
export const getAllReviews = async () => (await api.get("/api/reviews")).data;
export const approveReview = async (id: string) => (await api.patch(`/api/reviews/${id}/approve`)).data;
export const deleteReview = async (id: string) => (await api.delete(`/api/reviews/${id}`)).data;

export const uploadFile = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folder) formData.append("folder", folder);
  const response = await api.post("/api/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default api;

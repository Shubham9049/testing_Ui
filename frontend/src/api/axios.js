import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");

  if (user) {
    const userData = JSON.parse(user);

    config.headers.Authorization = `Bearer ${userData.token}`;
  }

  return config;
});

// Response Interceptor function
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");

        const newAccessToken = response.data.accessToken;

        const user = JSON.parse(localStorage.getItem("user"));

        user.token = newAccessToken;

        localStorage.setItem("user", JSON.stringify(user));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");

        throw refreshError;
      }
    }

    throw error;
  },
);
export default api;

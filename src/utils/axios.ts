import axios from "axios";
import config from "../../config";
import { authUrls } from "@/constants/authUrls";

const client = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY,
  },
});

client.interceptors.request.use(
  (config) => {
    if (typeof window !== undefined) {
      const token = localStorage.getItem("session");
      if (token) {
        const storedtoken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${storedtoken.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLogin = originalRequest?.url?.includes("login");
    const isRefresh = originalRequest?.url?.includes("token/refresh");

    if (
      error.response?.status === 401 &&
      !isLogin &&
      !isRefresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const sessionStr = localStorage.getItem("session");

      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);

          // Use a separate axios instance or direct call to avoid interceptors for refresh
          // The refresh token is sent via HttpOnly cookie automatically
          const response = await axios.post(
            `${config.BASE_URL}${authUrls.tokenRefresh}`,
            {},
            {
              withCredentials: true,
              headers: {
                "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY,
              },
            },
          );

          if (response.status === 200) {
            const newAccessToken = response.data.access;
            // Update session in localStorage
            const updatedSession = { ...session, access: newAccessToken };
            localStorage.setItem("session", JSON.stringify(updatedSession));

            // Update authorization header and retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // If refresh fails, proceed to logout
        }
      }

      // Standard logout for 401
      localStorage.removeItem("session");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default client;

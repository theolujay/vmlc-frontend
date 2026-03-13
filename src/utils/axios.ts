import axios from "axios";
import config from "../../config";
import { authUrls } from "@/constants/authUrls";

const client = axios.create({
  baseURL: config.BASE_URL,
  // timeout:4000,
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
      const isRememberMe = localStorage.getItem("remember_me") === "true";

      if (isRememberMe) {
        originalRequest._retry = true;
        const sessionStr = localStorage.getItem("session");

        if (sessionStr) {
          try {
            const session = JSON.parse(sessionStr);
            const refreshToken = session.refresh;

            if (refreshToken) {
              // Use a separate axios instance or direct call to avoid interceptors for refresh
              const response = await axios.post(
                `${config.BASE_URL}${authUrls.tokenRefresh}`,
                {
                  refresh: refreshToken,
                },
                {
                  headers: {
                    "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY,
                  },
                },
              );

              if (response.status === 200) {
                const newAccessToken = response.data.access;
                // Update session in localStorage
                const updatedSession = { ...session, access: newAccessToken };
                // If the refresh endpoint also returns a new refresh token, update it too
                if (response.data.refresh) {
                  updatedSession.refresh = response.data.refresh;
                }
                localStorage.setItem("session", JSON.stringify(updatedSession));

                // Update authorization header and retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return client(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // If refresh fails, proceed to logout
          }
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

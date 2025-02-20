import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Get the API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL environment variable is not defined");
}

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the bearer token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven"t tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        
        // Call your refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        // Store the new tokens
        const { access_token, refresh_token } = response.data;
        await SecureStore.setItemAsync("access_token", access_token);
        await SecureStore.setItemAsync("refresh_token", refresh_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., logout user)
        // You might want to implement your logout logic here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 
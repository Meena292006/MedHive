import axios from "axios";
import { auth } from "../firebase";

export const api = axios.create({
  baseURL: "http://localhost:5055/api"
});

// Add request interceptor to automatically attach Firebase token
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-user-uid"] = user.uid;
    } catch (error) {
      console.error("Error getting Firebase token", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

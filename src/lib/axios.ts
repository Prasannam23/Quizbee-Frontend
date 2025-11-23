import axios from 'axios';
import { getCookie } from '@/utils/getToken';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      // Add token to Authorization header (requires backend CORS to allow it)
      config.headers.Authorization = `Bearer ${token}`;
      // Also try sending as custom header that might bypass preflight
      config.headers['X-Auth-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Not logged in. Clearing auth state.');
      // Optionally redirect to login or clear auth
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
});

// Request interceptor to attach token manually
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get JWT from localStorage
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: token expired or not logged in.");
      // Optional: redirect to login
      // Router.push("/signin");
    }
    return Promise.reject(error);
  }
);

export default api;

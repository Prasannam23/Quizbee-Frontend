import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true, // <--- required for sending cookies
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No manual token attaching here — cookie will be sent automatically.
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
      console.warn("Unauthorized: token expired or not logged in.");
      // Optional: redirect or clear user session
      // Router.push("/signin");
    }
    return Promise.reject(error);
  }
);

export default api;

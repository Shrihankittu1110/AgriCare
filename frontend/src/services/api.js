import axios from 'axios';

// Normalize API base URL to handle trailing slashes or omitted /api paths
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://agricare-mc0n.onrender.com/api';
  url = url.trim().replace(/\/+$/, '');
  // If user passed e.g. https://agricare-mc0n.onrender.com without /api, append /api
  if (url.startsWith('http') && !url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agricare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not on login/register page, clear token
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('agricare_token');
        localStorage.removeItem('agricare_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

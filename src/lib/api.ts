import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // important if using HTTP-only cookies
});

export default apiClient;
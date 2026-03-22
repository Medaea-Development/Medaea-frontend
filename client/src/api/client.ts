import axios from 'axios';

  export const api = axios.create({
      baseURL: '/api/v1',
      headers: {
          'Content-Type': 'application/json',
      },
      timeout: 10000,
  });

  api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  });

  export const getAssetUrl = (path: string | null | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return cleanPath;
  };
  
// client.js - clientul Axios pentru comunicarea cu backend-ul
// aici se configureaza URL-ul API-ului si se adauga token-ul JWT la fiecare request

import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

// cream o instanta de axios cu URL-ul backend-ului din .env
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
});

// interceptor pentru requests - adauga token-ul JWT la fiecare request
// asta inseamna ca nu trebuie sa-l adaugam manual de fiecare data
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // punem token-ul in header-ul Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor pentru responses - daca primim 401 (neautorizat), stergem token-ul
// si redirectam userul la login - dar nu pentru rutele de autentificare
client.interceptors.response.use(
  (response) => response, // daca e ok, returnam raspunsul normal
  (error) => {
    // verificam daca e eroare 401 si nu e pe ruta de autentificare
    const isAuthRoute = error.config?.url?.includes('/auth/');
    
    if (error.response?.status === 401 && !isAuthRoute) {
      // stergem token-ul si redirectam la login
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;

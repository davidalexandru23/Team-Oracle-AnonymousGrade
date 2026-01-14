// auth.js - functii pentru autentificare (login, register, verificare user)
// toate requesturile de aici sunt catre /auth pe backend

import client from './client';

// login - trimitem email si parola, primim token si datele userului
export const login = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

// register - cream cont nou cu nume, email, parola si rol (STUDENT sau TEACHER)
export const register = async (name, email, password, role) => {
  const response = await client.post('/auth/register', { name, email, password, role });
  return response.data;
};

// getMe - verificam cine e logat (trimitem token-ul, primim datele userului)
export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

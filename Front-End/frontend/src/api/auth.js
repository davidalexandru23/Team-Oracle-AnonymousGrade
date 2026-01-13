import client from './client';

// login user
export const login = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

// register new user
export const register = async (name, email, password, role) => {
  const response = await client.post('/auth/register', { name, email, password, role });
  return response.data;
};

// get current user info
export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

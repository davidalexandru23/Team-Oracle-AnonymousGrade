// projects.js - functii pentru proiecte

import client from './client';

// ia toate proiectele (studentii vad doar proiectele lor, profesorii vad tot)
export const getProjects = async () => {
  const response = await client.get('/projects');
  return response.data;
};

// ia detaliile unui proiect specific
export const getProject = async (projectId) => {
  const response = await client.get(`/projects/${projectId}`);
  return response.data;
};

// creeaza un proiect nou (dar asta se face acum prin echipe)
export const createProject = async (title, description) => {
  const response = await client.post('/projects', { title, description });
  return response.data;
};

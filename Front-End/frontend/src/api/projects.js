import client from './client';

// get all projects (student gets own, teacher gets all)
export const getProjects = async () => {
  const response = await client.get('/projects');
  return response.data;
};

// get single project by id
export const getProject = async (id) => {
  const response = await client.get(`/projects/${id}`);
  return response.data;
};

// create new project
export const createProject = async (title, description) => {
  const response = await client.post('/projects', { title, description });
  return response.data;
};

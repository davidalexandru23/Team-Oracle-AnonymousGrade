import client from './client';

// Get all teams where user is owner or member
export const getTeams = async () => {
  const response = await client.get('/teams');
  return response.data;
};

// Get single team by ID with its projects
export const getTeam = async (teamId) => {
  const response = await client.get(`/teams/${teamId}`);
  return response.data;
};

// Create a new team
export const createTeam = async (name, description) => {
  const response = await client.post('/teams', { name, description });
  return response.data;
};

// Add a project to a team
export const addProjectToTeam = async (teamId, title, description) => {
  const response = await client.post(`/teams/${teamId}/projects`, { title, description });
  return response.data;
};

// Add a member to a team (by student ID)
export const addTeamMember = async (teamId, studentId) => {
  const response = await client.post(`/teams/${teamId}/members`, { studentId });
  return response.data;
};

// Remove a member from a team
export const removeTeamMember = async (teamId, memberId) => {
  const response = await client.delete(`/teams/${teamId}/members/${memberId}`);
  return response.data;
};

// Get available students to add to team
export const getAvailableStudents = async (teamId) => {
  const response = await client.get(`/teams/${teamId}/available-students`);
  return response.data;
};

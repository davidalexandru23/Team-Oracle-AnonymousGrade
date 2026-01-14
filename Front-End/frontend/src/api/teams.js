// teams.js - functii pentru comunicarea cu API-ul de echipe
// echipele sunt grupuri de studenti care lucreaza la proiecte impreuna

import client from './client';

// ia toate echipele in care userul e owner sau membru
export const getTeams = async () => {
  const response = await client.get('/teams');
  return response.data;
};

// ia detaliile unei echipe (proiecte, membri, etc)
export const getTeam = async (teamId) => {
  const response = await client.get(`/teams/${teamId}`);
  return response.data;
};

// creeaza o echipa noua - userul curent devine owner
export const createTeam = async (name, description) => {
  const response = await client.post('/teams', { name, description });
  return response.data;
};

// adauga un proiect la o echipa (doar ownerul poate)
export const addProjectToTeam = async (teamId, title, description) => {
  const response = await client.post(`/teams/${teamId}/projects`, { title, description });
  return response.data;
};

// adauga un membru la echipa (trimitem ID-ul studentului)
export const addTeamMember = async (teamId, studentId) => {
  const response = await client.post(`/teams/${teamId}/members`, { studentId });
  return response.data;
};

// sterge un membru din echipa
export const removeTeamMember = async (teamId, memberId) => {
  const response = await client.delete(`/teams/${teamId}/members/${memberId}`);
  return response.data;
};

// ia lista de studenti care pot fi adaugati (nu sunt deja in echipa)
export const getAvailableStudents = async (teamId) => {
  const response = await client.get(`/teams/${teamId}/available-students`);
  return response.data;
};

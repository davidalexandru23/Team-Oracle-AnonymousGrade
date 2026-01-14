// deliverables.js - functii pentru livrabile (etapele unui proiect)

import client from './client';

// ia toate livrabilele unui proiect
export const getDeliverables = async (projectId) => {
  const response = await client.get(`/projects/${projectId}/deliverables`);
  return response.data;
};

// creeaza un livrabil nou pentru un proiect
// trebuie sa trimitem titlu, descriere, deadline si optional URL demo
export const createDeliverable = async (projectId, data) => {
  const response = await client.post(`/projects/${projectId}/deliverables`, data);
  return response.data;
};

// actualizeaza URL-ul demo pentru un livrabil
export const updateDemoUrl = async (deliverableId, demoUrl) => {
  const response = await client.patch(`/deliverables/${deliverableId}/demo-url`, { demoUrl });
  return response.data;
};

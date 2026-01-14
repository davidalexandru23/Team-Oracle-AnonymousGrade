// jury.js - functii pentru sistemul de jurizare (alocarea evaluatorilor si preluarea task-urilor)

import client from './client';

// aloca un juriu pentru un livrabil (doar profesorii pot)
// trimitem si deadline-ul pana cand pot evalua
export const assignJury = async (deliverableId, expiresAt) => {
  const response = await client.post(`/deliverables/${deliverableId}/assign-jury`, { expiresAt });
  return response.data;
};

// ia toate evaluarile mele ca student (proiectele pe care trebuie sa le notez)
export const getMyAssignments = async () => {
  const response = await client.get('/my-assignments');
  return response.data;
};

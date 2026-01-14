// grades.js - functii pentru note (trimitere nota si vizualizare note)

import client from './client';

// trimite o nota pentru un livrabil (doar daca esti in juriu)
// nota e intre 1 si 10, cu maxim 2 zecimale
export const submitGrade = async (deliverableId, score) => {
  const response = await client.post(`/deliverables/${deliverableId}/grade`, { score });
  return response.data;
};

// ia notele pentru un livrabil (ownerul vede nota finala, profesorul vede notele individuale)
export const getGrades = async (deliverableId) => {
  const response = await client.get(`/deliverables/${deliverableId}/grades`);
  return response.data;
};

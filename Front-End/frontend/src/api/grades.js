import client from './client';

// submit or update grade for a deliverable
export const submitGrade = async (deliverableId, score) => {
  const response = await client.post(`/deliverables/${deliverableId}/grade`, { score });
  return response.data;
};

// get grades for a deliverable
export const getGrades = async (deliverableId) => {
  const response = await client.get(`/deliverables/${deliverableId}/grades`);
  return response.data;
};

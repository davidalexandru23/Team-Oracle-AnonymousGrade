import client from './client';

// assign jury to a deliverable (teacher only)
export const assignJury = async (deliverableId) => {
  const response = await client.post(`/deliverables/${deliverableId}/assign-jury`);
  return response.data;
};

// get my assignments as evaluator
export const getMyAssignments = async () => {
  const response = await client.get('/my-assignments');
  return response.data;
};

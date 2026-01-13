import client from './client';

// get deliverables for a project
export const getDeliverables = async (projectId) => {
  const response = await client.get(`/projects/${projectId}/deliverables`);
  return response.data;
};

// create new deliverable
export const createDeliverable = async (projectId, data) => {
  const response = await client.post(`/projects/${projectId}/deliverables`, data);
  return response.data;
};

// update demo URL for deliverable
export const updateDemoUrl = async (id, demoUrl) => {
  const response = await client.patch(`/deliverables/${id}/demo-url`, { demoUrl });
  return response.data;
};

import client from './client';

export const authApi = {
  login: (data) => client.post('/auth/login', data).then(r => r.data),
  register: (data) => client.post('/auth/register', data).then(r => r.data),
  me: () => client.get('/auth/me').then(r => r.data),
  users: () => client.get('/auth/users').then(r => r.data)
};

export const assetApi = {
  list: () => client.get('/assets').then(r => r.data),
  get: (id) => client.get(`/assets/${id}`).then(r => r.data),
  create: (data) => client.post('/assets', data).then(r => r.data),
  update: (id, data) => client.put(`/assets/${id}`, data).then(r => r.data),
  remove: (id) => client.delete(`/assets/${id}`)
};

export const categoryApi = {
  list: () => client.get('/categories').then(r => r.data),
  create: (data) => client.post('/categories', data).then(r => r.data),
  update: (id, data) => client.put(`/categories/${id}`, data).then(r => r.data),
  remove: (id) => client.delete(`/categories/${id}`)
};

export const assignmentApi = {
  list: () => client.get('/assignments').then(r => r.data),
  byUser: (userId) => client.get(`/assignments/user/${userId}`).then(r => r.data),
  byAsset: (assetId) => client.get(`/assignments/asset/${assetId}`).then(r => r.data),
  assign: (data) => client.post('/assignments/assign', data).then(r => r.data),
  return: (assetId, remarks) => client.post(`/assignments/return/${assetId}`, { remarks }).then(r => r.data)
};

export const inventoryApi = {
  list: () => client.get('/inventory').then(r => r.data),
  lowStock: () => client.get('/inventory/low-stock').then(r => r.data),
  create: (data) => client.post('/inventory', data).then(r => r.data),
  update: (id, data) => client.put(`/inventory/${id}`, data).then(r => r.data),
  remove: (id) => client.delete(`/inventory/${id}`)
};

export const dashboardApi = {
  stats: () => client.get('/dashboard/stats').then(r => r.data)
};
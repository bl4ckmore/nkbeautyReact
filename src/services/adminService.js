import { apiFetch } from './api';

export const getStats = () => apiFetch('/admin/stats');

export const getAdminOrders = (status) =>
  apiFetch(`/admin/orders${status && status !== 'all' ? `?status=${status}` : ''}`);

export const updateOrderStatus = (id, status) =>
  apiFetch(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const deleteAdminOrder = (id) =>
  apiFetch(`/admin/orders/${id}`, { method: 'DELETE' });

export const getUsers = () => apiFetch('/admin/users');

// Services
export const getAdminServices = () => apiFetch('/services');

export const createService = (dto) =>
  apiFetch('/services', { method: 'POST', body: JSON.stringify(dto) });

export const updateService = (id, dto) =>
  apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(dto) });

export const deleteService = (id) =>
  apiFetch(`/services/${id}`, { method: 'DELETE' });

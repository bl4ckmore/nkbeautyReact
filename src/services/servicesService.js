import { apiFetch } from './api';

export const getServices = () => apiFetch('/services');

import { apiFetch } from './api';
import { SERVICES } from './catalogData';

const normalize = (o) => ({
  ...o,
  status: o.status.toLowerCase(),
  time: o.time?.substring(0, 5),
});

export async function getOrders() {
  const data = await apiFetch('/orders');
  return data.map(normalize);
}

export async function getOrderById(id) {
  const data = await apiFetch(`/orders/${id}`);
  return normalize(data);
}

export async function createOrder(d) {
  const service = SERVICES.find(s => s.name === d.service);
  if (!service) throw new Error('Service not found');
  const data = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({
      clientName: d.clientName,
      serviceId: service.id,
      date: d.date,
      time: d.time.length === 5 ? `${d.time}:00` : d.time,
      notes: d.notes || '',
    }),
  });
  return normalize(data);
}

export async function updateOrder(id, d) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const data = await apiFetch(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      clientName: d.clientName,
      date: d.date,
      time: d.time ? (d.time.length === 5 ? `${d.time}:00` : d.time) : undefined,
      status: d.status ? capitalize(d.status) : undefined,
      notes: d.notes,
    }),
  });
  return normalize(data);
}

export async function deleteOrder(id) {
  await apiFetch(`/orders/${id}`, { method: 'DELETE' });
  return { ok: true };
}

export const STATUS = {
  pending:   { label: 'Pending',   color: '#c4a35a' },
  confirmed: { label: 'Confirmed', color: '#7aaa8a' },
  cancelled: { label: 'Cancelled', color: '#c87070' },
  completed: { label: 'Completed', color: '#7098c8' },
};

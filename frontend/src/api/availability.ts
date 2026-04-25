import api from './client';
import type { Availability } from '../types';

export interface AvailabilityPayload {
  is_recurring: boolean;
  day_of_week?: number;
  specific_date?: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export const availabilityApi = {
  getFamily: () =>
    api.get<Availability[]>('/api/availability').then(r => r.data),

  getUser: (userId: string) =>
    api.get<Availability[]>(`/api/availability/${userId}`).then(r => r.data),

  create: (data: AvailabilityPayload) =>
    api.post<Availability>('/api/availability', data).then(r => r.data),

  update: (id: string, data: Partial<AvailabilityPayload>) =>
    api.put<Availability>(`/api/availability/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/api/availability/${id}`).then(r => r.data),
};

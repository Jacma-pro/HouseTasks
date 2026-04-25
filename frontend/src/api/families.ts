import api from './client';
import type { Family } from '../types';

export const familiesApi = {
  getMyFamily: () =>
    api.get<Family>('/api/families/me').then(r => r.data),

  create: (name: string) =>
    api.post<Family>('/api/families', { name }).then(r => r.data),

  invite: (email: string) =>
    api.post('/api/families/invite', { email }).then(r => r.data),

  join: (token: string) =>
    api.post(`/api/families/join/${token}`).then(r => r.data),
};

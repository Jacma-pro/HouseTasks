import api from './client';
import type { User } from '../types';

export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { email: string; password: string; name: string; }
export interface AuthResponse { user: User; access_token: string; refresh_token: string; }

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/api/auth/login', data).then(r => r.data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/api/auth/register', data).then(r => r.data),

  logout: () =>
    api.post('/api/auth/logout').then(r => r.data),

  me: () =>
    api.get<User>('/api/auth/me').then(r => r.data),
};

import api from './client';
import type { Task, TaskStatus } from '../types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
  assigned_to?: string[];
  helpers?: string[];
}

export const tasksApi = {
  getAll: (params?: { status?: string; assigned_to?: string; created_by?: string }) =>
    api.get<Task[]>('/api/tasks', { params }).then(r => r.data),

  getOne: (id: string) =>
    api.get<Task>(`/api/tasks/${id}`).then(r => r.data),

  create: (data: CreateTaskPayload) =>
    api.post<Task>('/api/tasks', data).then(r => r.data),

  update: (id: string, data: Partial<CreateTaskPayload>) =>
    api.put<Task>(`/api/tasks/${id}`, data).then(r => r.data),

  updateStatus: (id: string, status: TaskStatus) =>
    api.patch<Task>(`/api/tasks/${id}/status`, { status }).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/api/tasks/${id}`).then(r => r.data),
};

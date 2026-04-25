export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface Family {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  members: FamilyMember[];
}

export interface FamilyMember {
  role: 'admin' | 'member';
  joined_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  family_id: string;
  title: string;
  description?: string;
  created_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  assigned_to: string[];
  helpers: string[];
}

export interface Availability {
  id: string;
  user_id: string;
  family_id: string;
  is_recurring: boolean;
  day_of_week?: number;
  specific_date?: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface Dashboard {
  family: Family;
  members: FamilyMember[];
  tasks: {
    stats: TaskStats;
    due_soon: Task[];
    my_tasks: Task[];
  };
  recent_activity: {
    id: string;
    action: string;
    created_at: string;
    task?: { id: string; title: string };
    changer?: { id: string; name: string };
  }[];
}

export interface ApiError {
  error: string;
  details?: unknown;
}

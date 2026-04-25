import type { TaskPriority, TaskStatus } from '../../types';

const statusStyles: Record<TaskStatus, string> = {
  pending:     'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  completed:   'bg-primary-100 text-primary-700',
  cancelled:   'bg-red-100 text-red-600',
};

const statusLabels: Record<TaskStatus, string> = {
  pending:     'En attente',
  in_progress: 'En cours',
  completed:   'Terminé',
  cancelled:   'Annulé',
};

const priorityStyles: Record<TaskPriority, string> = {
  low:    'bg-gray-100 text-gray-500',
  medium: 'bg-accent-100 text-accent-600',
  high:   'bg-red-100 text-red-600',
};

const priorityLabels: Record<TaskPriority, string> = {
  low:    'Faible',
  medium: 'Moyen',
  high:   'Haute',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[priority]}`}>
      {priorityLabels[priority]}
    </span>
  );
}

import type { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from './Badge';
import Button from './Button';
import Overlay from './Overlay';
import { Calendar, Trash2 } from 'lucide-react';

const STATUS_TRANSITIONS: Record<TaskStatus, { next: TaskStatus; label: string }[]> = {
  pending:     [{ next: 'in_progress', label: 'Démarrer' }, { next: 'cancelled', label: 'Annuler' }],
  in_progress: [{ next: 'completed', label: 'Terminer' }, { next: 'cancelled', label: 'Annuler' }],
  completed:   [{ next: 'pending', label: 'Rouvrir' }],
  cancelled:   [{ next: 'pending', label: 'Rouvrir' }],
};

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
}

export default function TaskModal({ task, onClose, onStatusChange, onDelete }: TaskModalProps) {
  const transitions = STATUS_TRANSITIONS[task.status];

  return (
    <Overlay onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{task.title}</h2>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {task.due_date && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            Échéance {new Date(task.due_date).toLocaleDateString('fr-FR', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            })}
          </div>
        )}

        {transitions.length > 0 && (
          <div className="flex gap-2">
            {transitions.map(({ next, label }) => (
              <Button
                key={next}
                variant={next === 'cancelled' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => onStatusChange(next)}
              >
                {label}
              </Button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 size={14} /> Supprimer
          </Button>
        </div>
      </div>
    </Overlay>
  );
}

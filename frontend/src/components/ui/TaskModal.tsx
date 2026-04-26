import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from './Badge';
import Button from './Button';
import Input from './Input';
import Overlay from './Overlay';
import { Calendar, Trash2, Pencil, X } from 'lucide-react';

const STATUS_TRANSITIONS: Record<TaskStatus, { next: TaskStatus; label: string }[]> = {
  pending:     [{ next: 'in_progress', label: 'Démarrer' }, { next: 'cancelled', label: 'Annuler' }],
  in_progress: [{ next: 'completed', label: 'Terminer' }, { next: 'cancelled', label: 'Annuler' }],
  completed:   [{ next: 'pending', label: 'Rouvrir' }],
  cancelled:   [{ next: 'pending', label: 'Rouvrir' }],
};

type EditForm = {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string;
};

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
  onEdit: (data: { title: string; description?: string; priority: 'low' | 'medium' | 'high'; due_date?: string }) => Promise<void>;
}

export default function TaskModal({ task, onClose, onStatusChange, onDelete, onEdit }: TaskModalProps) {
  const [editing, setEditing] = useState(false);
  const transitions = STATUS_TRANSITIONS[task.status];

  const existingDate = task.due_date
    ? new Date(task.due_date).toISOString().split('T')[0]
    : '';

  const { register, handleSubmit, formState: { isSubmitting, errors }, reset } = useForm<EditForm>({
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      due_date: existingDate,
    },
  });

  function startEdit() { setEditing(true); }
  function cancelEdit() { reset(); setEditing(false); }

  async function onSubmit(data: EditForm) {
    await onEdit({
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      due_date: data.due_date ? `${data.due_date}T00:00:00.000Z` : undefined,
    });
    setEditing(false);
  }

  return (
    <Overlay onClose={onClose}>
      {editing ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-gray-900">Modifier la tâche</h2>
            <button onClick={cancelEdit} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
            <Input
              id="edit-title"
              label="Titre"
              error={errors.title?.message}
              {...register('title', { required: 'Titre requis' })}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-desc" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="edit-desc"
                rows={2}
                placeholder="Optionnel"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
                {...register('description')}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-priority" className="text-sm font-medium text-gray-700">Priorité</label>
                <select
                  id="edit-priority"
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-white"
                  {...register('priority')}
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <Input id="edit-due-date" type="date" label="Échéance" {...register('due_date')} />
            </div>
            <div className="flex gap-2 mt-1">
              <Button variant="ghost" fullWidth type="button" onClick={cancelEdit}>Annuler</Button>
              <Button fullWidth type="submit" isLoading={isSubmitting}>Enregistrer</Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{task.title}</h2>
              {task.description && (
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              )}
            </div>
            <button
              onClick={startEdit}
              className="shrink-0 p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Modifier"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          {task.due_date && (() => {
            const isActive = task.status === 'pending' || task.status === 'in_progress';
            const isOverdue = isActive && new Date(task.due_date) < new Date();
            return (
              <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                <Calendar size={14} />
                {isOverdue && 'En retard · '}
                Échéance {new Date(task.due_date).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            );
          })()}

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
      )}
    </Overlay>
  );
}

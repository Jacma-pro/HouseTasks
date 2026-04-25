import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasksApi, type CreateTaskPayload } from '../api/tasks';
import type { Task, TaskStatus } from '../types';
import Card from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TaskModal from '../components/ui/TaskModal';
import Overlay from '../components/ui/Overlay';

const STATUSES: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'Toutes' },
  { value: 'pending',     label: 'En attente' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed',   label: 'Terminées' },
  { value: 'cancelled',   label: 'Annulées' },
];

function CreateTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Record<string, string>>();
  const [apiError, setApiError] = useState('');

  async function onSubmit(data: Record<string, string>) {
    setApiError('');
    try {
      const payload: CreateTaskPayload = {
        title: data.title,
        description: data.description || undefined,
        priority: (data.priority as 'low' | 'medium' | 'high') ?? 'medium',
        due_date: data.due_date || undefined,
        assigned_to: [],
        helpers: [],
      };
      await tasksApi.create(payload);
      onCreated();
    } catch {
      setApiError('Impossible de créer la tâche.');
    }
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Nouvelle tâche</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        <Input
          id="title"
          label="Titre"
          placeholder="Ex: Faire les courses"
          error={errors.title?.message as string}
          {...register('title', { required: 'Titre requis' })}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            rows={2}
            placeholder="Optionnel"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none"
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priorité</label>
            <select
              id="priority"
              defaultValue="medium"
              className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none bg-white"
              {...register('priority')}
            >
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <Input id="due_date" type="date" label="Échéance" {...register('due_date')} />
        </div>
        {apiError && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{apiError}</p>}
        <div className="flex gap-2 mt-1">
          <Button variant="ghost" fullWidth onClick={onClose} type="button">Annuler</Button>
          <Button fullWidth isLoading={isSubmitting} type="submit">Créer</Button>
        </div>
      </form>
    </Overlay>
  );
}

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => tasksApi.getAll(filter !== 'all' ? { status: filter } : undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return (
    <div className="flex flex-col px-4 py-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Tâches</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Nouvelle
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={[
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              filter === value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-gray-400">
          <Filter size={36} strokeWidth={1.2} />
          <p className="text-sm">Aucune tâche trouvée</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-card-hover transition-shadow active:scale-[0.99]"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                      )}
                      {task.due_date && (
                        <p className="mt-1 text-xs text-gray-400">
                          Échéance {new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={(status) => { statusMutation.mutate({ id: selectedTask.id, status }); setSelectedTask(null); }}
          onDelete={() => { deleteMutation.mutate(selectedTask.id); setSelectedTask(null); }}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { qc.invalidateQueries({ queryKey: ['tasks'] }); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

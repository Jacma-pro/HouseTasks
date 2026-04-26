import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Clock, ListTodo, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { tasksApi } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import TaskModal from '../components/ui/TaskModal';
import type { Task, TaskStatus } from '../types';

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </Card>
  );
}

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  const isActive = task.status === 'pending' || task.status === 'in_progress';
  const isOverdue = isActive && task.due_date && new Date(task.due_date) < new Date();
  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="flex items-center justify-between gap-3 min-h-[44px] py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors rounded-xl cursor-pointer">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900 text-sm">{task.title}</p>
          {task.due_date && (
            <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              {isOverdue && '⚠ '}Échéance {new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof tasksApi.update>[1] }) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  if (isLoading) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{greeting},</p>
          <h1 className="text-xl font-bold text-gray-900">{user?.name ?? 'vous'} 👋</h1>
        </div>
        {user && <Avatar name={user.name} avatar_url={user.avatar_url} />}
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="En attente"
            value={data.tasks.stats.pending}
            icon={<ListTodo size={18} className="text-gray-600" />}
            color="bg-gray-100"
          />
          <StatCard
            label="En cours"
            value={data.tasks.stats.in_progress}
            icon={<Clock size={18} className="text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            label="Terminées"
            value={data.tasks.stats.completed}
            icon={<CheckCircle2 size={18} className="text-primary-600" />}
            color="bg-primary-100"
          />
          <StatCard
            label="Annulées"
            value={data.tasks.stats.cancelled}
            icon={<XCircle size={18} className="text-red-500" />}
            color="bg-red-100"
          />
        </div>
      )}

      {/* Membres */}
      {data?.members && data.members.length > 0 && (
        <Card>
          <h2 className="mb-3 font-semibold text-gray-900">Membres</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {data.members.map((m) => (
              <div key={m.user?.id} className="flex flex-col items-center gap-1.5 shrink-0">
                <Avatar name={m.user?.name ?? '?'} avatar_url={m.user?.avatar_url} />
                <p className="text-xs text-gray-600 max-w-[60px] truncate text-center">{m.user?.name}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* À faire */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">À faire</h2>
          <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">
            Voir tout
          </Link>
        </div>
        {data?.tasks.active && data.tasks.active.length > 0 ? (
          data.tasks.active.map((task) => (
            <TaskRow key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))
        ) : (
          <p className="py-4 text-center text-sm text-gray-400">Rien à faire pour l'instant</p>
        )}
      </Card>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={(status) => {
            statusMutation.mutate({ id: selectedTask.id, status });
            setSelectedTask(null);
          }}
          onDelete={() => {
            deleteMutation.mutate(selectedTask.id);
            setSelectedTask(null);
          }}
          onEdit={async (data) => {
            await editMutation.mutateAsync({ id: selectedTask.id, data });
          }}
        />
      )}
    </div>
  );
}

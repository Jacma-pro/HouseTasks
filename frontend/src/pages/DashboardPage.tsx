import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, ListTodo, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import type { Task } from '../types';

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

function TaskRow({ task }: { task: Task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors rounded-xl">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900 text-sm">{task.title}</p>
          {task.due_date && (
            <p className="text-xs text-gray-400 mt-0.5">
              Échéance {new Date(task.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
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
            value={data.tasks.pending}
            icon={<ListTodo size={18} className="text-gray-600" />}
            color="bg-gray-100"
          />
          <StatCard
            label="En cours"
            value={data.tasks.in_progress}
            icon={<Clock size={18} className="text-blue-600" />}
            color="bg-blue-100"
          />
          <StatCard
            label="Terminées"
            value={data.tasks.completed}
            icon={<CheckCircle2 size={18} className="text-primary-600" />}
            color="bg-primary-100"
          />
          <StatCard
            label="Annulées"
            value={data.tasks.cancelled}
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
              <div key={m.user_id} className="flex flex-col items-center gap-1.5 shrink-0">
                <Avatar name={m.profile?.name ?? '?'} avatar_url={m.profile?.avatar_url} />
                <p className="text-xs text-gray-600 max-w-[60px] truncate text-center">{m.profile?.name}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tâches récentes */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Tâches récentes</h2>
          <Link to="/tasks" className="text-sm font-medium text-primary-600 hover:underline">
            Voir tout
          </Link>
        </div>
        {data?.recentTasks && data.recentTasks.length > 0 ? (
          data.recentTasks.slice(0, 5).map((task) => <TaskRow key={task.id} task={task} />)
        ) : (
          <p className="py-4 text-center text-sm text-gray-400">Aucune tâche pour l'instant</p>
        )}
      </Card>
    </div>
  );
}

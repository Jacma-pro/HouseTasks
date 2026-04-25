import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarDays, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import type { Dashboard } from '../../types';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tâches' },
  { to: '/agenda',    icon: CalendarDays,    label: 'Agenda' },
  { to: '/profile',   icon: User,            label: 'Profil' },
];

export default function BottomNav() {
  const qc = useQueryClient();
  const dashboard = qc.getQueryData<Dashboard>(['dashboard']);
  const pending = dashboard?.tasks.stats.pending ?? 0;
  const inProgress = dashboard?.tasks.stats.in_progress ?? 0;
  const activeCount = pending + inProgress;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 safe-area-inset-bottom">
      <div className="flex h-16 max-w-lg mx-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors duration-150"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-primary-600' : 'text-gray-400'}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {to === '/tasks' && activeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white leading-none">
                      {activeCount > 99 ? '99+' : activeCount}
                    </span>
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

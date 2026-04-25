import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const links = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Accueil' },
  { to: '/tasks',        icon: CheckSquare,     label: 'Tâches' },
  { to: '/availability', icon: Clock,           label: 'Dispos' },
  { to: '/profile',      icon: User,            label: 'Profil' },
];

export default function BottomNav() {
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
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-primary-600' : 'text-gray-400'}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
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

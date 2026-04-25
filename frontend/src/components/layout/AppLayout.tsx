import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuth } from '../../context/AuthContext';
import { useFamilyGuard } from '../../hooks/useFamilyGuard';

export default function AppLayout() {
  const { user, isLoading } = useAuth();
  const { hasFamily, isChecking } = useFamilyGuard();

  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-primary-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!hasFamily) return <Navigate to="/onboarding" replace />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { familiesApi } from '../api/families';
import { useAuth } from '../context/AuthContext';

export function useFamilyGuard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: familiesApi.getMyFamily,
    enabled: !!user,
    retry: false,
  });

  return {
    family: data ?? null,
    hasFamily: !!data,
    isChecking: isLoading,
  };
}

import { useAuth } from '@/contexts/AuthProvider';

export default function useGetCurrentUser() {
  const { authState } = useAuth();
  return authState;
}

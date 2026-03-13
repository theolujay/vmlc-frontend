import { useQuery } from '@tanstack/react-query';
import { UserMgtService } from '@/services/UserMgt.service';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect } from 'react';

export default function useProfile() {
  const { authState, dispatch } = useAuth();
  
  const query = useQuery({
    queryKey: ['own-profile'],
    queryFn: UserMgtService.getOwnAccountDetails,
    enabled: !!authState.token && authState.isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data?.profile) {
      dispatch({ type: 'updateProfile', payload: query.data.profile });
    }
  }, [query.data, dispatch]);

  return query;
}

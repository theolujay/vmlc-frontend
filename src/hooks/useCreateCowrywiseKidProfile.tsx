import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CowrywiseKidsService } from '@/services/CowrywiseKids.service';
import { toast } from 'react-toastify';

export function useCreateCowrywiseKidProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => CowrywiseKidsService.createProfile(username),
        onSuccess: () => {
            toast.success('Cowrywise Kid profile linked successfully!');
            // Invalidate account details to refresh has_cowrywise_kid_profile
            queryClient.invalidateQueries({ queryKey: ['account-details'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.error || 'Failed to link Cowrywise Kid profile. Please try again.';
            toast.error(errorMessage);
        }
    });
}

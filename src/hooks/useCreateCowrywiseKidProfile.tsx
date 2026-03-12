import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CowrywiseKidsService } from '@/services/CowrywiseKids.service';
import { toast } from 'react-toastify';

export function useCreateCowrywiseKidProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (username: string) => CowrywiseKidsService.createProfile(username),
        onSuccess: () => {
            toast.success('Cowrywise Kid username linked successfully!');
            // Invalidate account details and dashboard to refresh has_cowrywise_kid_profile and UI state
            queryClient.invalidateQueries({ queryKey: ['account-details'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['exam-dashboard'] });
        },
        onError: (error: unknown) => {
            const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to link Cowrywise Kid username. Please try again.';
            toast.error(errorMessage);
        }
    });
}

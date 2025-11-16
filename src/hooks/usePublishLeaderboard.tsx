import { CandidateMgtService } from '@/services/candidateMgt.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function usePublishLeaderboard(onSuccessCallback: () => void) {
    const { isPending, mutate } = useMutation({
        mutationKey: ['publish-leaderboard'],
        mutationFn: CandidateMgtService.publishLeaderBoard,
        onSuccess: () => {

            toast.success('Dashboard published successfully')
            onSuccessCallback()
        },
        onError: () => {
            toast.error('Error publishing dashboard')
        }
    })


    function onSubmit() {
        mutate();
    }
    return { isPending, onSubmit }
}

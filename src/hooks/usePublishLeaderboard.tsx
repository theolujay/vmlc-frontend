import { CandidateMgtService } from '@/services/candidateMgt.service';
import { useMutation } from '@tanstack/react-query';

export default function usePublishLeaderboard() {
  const {isPending,mutate}=useMutation({
    mutationKey:['publish-leaderboard'],
    mutationFn:CandidateMgtService.publishLeaderBoard
  })


  function onSubmit(){
    mutate();
  }
  return {isPending,onSubmit}
}

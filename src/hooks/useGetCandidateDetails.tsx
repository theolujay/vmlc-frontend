import { CandidateMgtService } from '@/services/candidateMgt.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetCandidateDetails(id: string) {
  const { isPending, data } = useQuery({
    queryKey: ['candidate-details', id],
    queryFn: () => CandidateMgtService.getCandidateDetails(id)
  })
  return { isPending, data }
}

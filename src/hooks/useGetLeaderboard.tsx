// import { ExamPortal } from '@/services/examPortal.service'
// import { useQuery } from '@tanstack/react-query'

// export default function useGetLeaderBoard() {
//   const {isPending,data}=useQuery({
//     queryKey:['leaderboard'],
//     queryFn:ExamPortal.getLeaderBoard,

//   })
//   return {isPending,data}
// }


import { ExamPortal } from '@/services/examPortal.service'
import { useQuery } from '@tanstack/react-query'

export default function useGetLeaderBoard(page: number=1, filters: Record<string, string|number>={}) {
  const { isPending, data } = useQuery({
    queryKey: ['leaderboard', page, filters],
    queryFn: () => ExamPortal.getLeaderBoard(page, filters),

  })
  return { isPending, data }
}

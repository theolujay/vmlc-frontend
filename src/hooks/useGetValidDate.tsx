import { useMemo, useState } from 'react';

export default function useGetValidDate(applicationDate: Date) {
  const today = new Date();
  const examDate = new Date(applicationDate);

  // ✅ Calculate day difference
  const daysDiff = useMemo(() => {
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms → days
  }, [examDate, today]);
  const isUpcomingDateDiff = daysDiff > 0;
  const [isUpcoming] = useState(isUpcomingDateDiff);

  return { isUpcoming, daysDiff }
}



export function useSortedExams<T extends { created_at: string | Date | number }>(exams: T[]) {
  return useMemo(() => {
     return [...exams].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
  }, [exams])
}




// export function useSortedExams(exams: any[]) {
//   return useMemo(() => {
//     //  return [...exams].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
//     return [...exams].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
//   }, [exams])
// }
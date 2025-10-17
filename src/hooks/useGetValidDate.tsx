import { useMemo, useState } from 'react';

export default function useGetValidDate(applicationDate: Date) {
  const today = new Date();
  const examDate = new Date(applicationDate);

  // ✅ Calculate day difference
  const daysDiff = useMemo(() => {
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms → days
  }, [examDate, today]);
  const isUpcoming = daysDiff > 0;
  const [isActive] = useState(isUpcoming);

  return { isActive, daysDiff }
}





export function useSortedExams(exams: any[]) {
  return useMemo(() => {
    return [...exams].sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
  }, [exams])
}
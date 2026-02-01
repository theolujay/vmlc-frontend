"use client"
import { useParams, useRouter } from 'next/navigation';
import ExamLayout from './ExamLayout'
import Questions from './ExamQuestions'
import useCandidateTakeExam from '@/hooks/useCandidateTakeExam';
import { useState, useEffect } from 'react';
import useSubmitAnswers from '@/hooks/useSubmitAnswers';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import { toast } from 'react-toastify';


export default function Exam() {
  const router = useRouter();
  const { examId } = useParams<{ examId: string }>();
  const { isPending, data } = useCandidateTakeExam(examId);
  const { data: dashboardData, isPending: dashboardPending } = useGetExamPortal();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { onSubmit, isPending: submitPending } = useSubmitAnswers(examId)

  useEffect(() => {
    if (!dashboardPending && dashboardData) {
      // Check if this specific exam is already done
      const activeExam = dashboardData.active_exam;
      if (activeExam && activeExam.id === examId && activeExam.has_participated) {
          toast.info("You have already completed this examination.");
          router.push('/exam-portal');
          return;
      }

      // Check concluded exams
      const isConcludedHistory = dashboardData.exam_history?.some(e => e.exam_id === examId);
      if (isConcludedHistory) {
        toast.info("This examination has already been concluded.");
        router.push('/exam-portal');
        return;
      }
    }
  }, [dashboardData, dashboardPending, examId, router]);

const formattedAnswers = {
    answers: Object.entries(answers).map(([questionId, selected_option]) => ({
      question: Number(questionId),
      selected_option,
    })),
  };



  function handleSubmit() {
    onSubmit(formattedAnswers)
  }

  if (dashboardPending || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
      </div>
    );
  }

  return (
    <ExamLayout onTimeUp={handleSubmit} timer={data?.countdown_minutes} title={data?.title}>
      <Questions submitPending={submitPending} handleSubmit={handleSubmit} answers={answers} setAnswers={setAnswers} isPending={isPending} data={data} />
    </ExamLayout>
  )
}

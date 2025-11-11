"use client"
import { useParams } from 'next/navigation';
import ExamLayout from './ExamLayout'
import Questions from './ExamQuestions'
import useCandidateTakeExam from '@/hooks/useCandidateTakeExam';
import { useState } from 'react';
import useSubmitAnswers from '@/hooks/useSubmitAnswers';


export default function Exam() {
  const { examId } = useParams<{ examId: string }>();
  const { isPending, data } = useCandidateTakeExam(examId);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { onSubmit } = useSubmitAnswers(examId)

  const formattedAnswers = {
    answers: Object.entries(answers).map(([questionId, selected_option]) => ({
      question: Number(questionId),
      selected_option,
    })),
  };



  function handleSubmit() {
    onSubmit(formattedAnswers)
  }
  return (
    <ExamLayout onTimeUp={handleSubmit} timer={data?.countdown_minutes}>
      <Questions submitPending={isPending} handleSubmit={handleSubmit} answers={answers} setAnswers={setAnswers} isPending={isPending} data={data} />
    </ExamLayout>
  )
}




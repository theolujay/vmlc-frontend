"use client"
import { useParams } from 'next/navigation';
import ExamLayout from './ExamLayout'
import Questions from './ExamQuestions'
import useCandidateTakeExam from '@/hooks/useCandidateTakeExam';
import { useState } from 'react';
import useSubmitAnswers from '@/hooks/useSubmitAnswers';
// import ExamQuestions from './ExamQuestions'

export default function Exam() {
  const { examId } = useParams<{ examId: string }>();
  console.log(examId, 'is exam id back here now')
  const { isPending, data } = useCandidateTakeExam(examId);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  console.log(data?.countdown_minutes, 'what is wrong with count down')

  const { isPending: submitPending, onSubmit } = useSubmitAnswers(examId)

   const formattedAnswers = {
    answers: Object.entries(answers).map(([questionId, selected_option]) => ({
      question: Number(questionId),
      selected_option,
    })),
  };
  console.log(answers, 'what is answers from layout exam')
  function handleSubmit() {
    console.log(formattedAnswers, 'answes submitted')
    onSubmit(formattedAnswers)
  }
  return (
    <ExamLayout onTimeUp={handleSubmit} timer={data?.countdown_minutes}>
      <Questions submitPending={isPending} handleSubmit={handleSubmit} answers={answers} setAnswers={setAnswers} isPending={isPending} data={data} />
    </ExamLayout>
  )
}




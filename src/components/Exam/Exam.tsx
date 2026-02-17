"use client"
import { useParams, useRouter } from 'next/navigation';
import ExamLayout from './ExamLayout'
import Questions from './ExamQuestions'
import useCandidateTakeExam from '@/hooks/useCandidateTakeExam';
import { useState, useEffect, useMemo } from 'react';
import useSubmitAnswers from '@/hooks/useSubmitAnswers';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import { toast } from 'react-toastify';
import { useAntiCheating } from '@/hooks/useAntiCheating';
import { shuffleArray } from '@/utils/generalUtils';
import { TakeExamType, TakeExamQuestionType } from '@/types/Examtype';

// Local types for shuffling logic
interface ShuffledTakeExamQuestionType extends TakeExamQuestionType {
  _optionMapping?: Record<string, string>;
}

interface ShuffledTakeExamType extends Omit<TakeExamType, 'questions'> {
  questions: ShuffledTakeExamQuestionType[];
}

export default function Exam() {
  const router = useRouter();
  const params = useParams();
  const examId = params?.examId as string;
  
  const { isPending, data } = useCandidateTakeExam(examId);
  const { data: dashboardData, isPending: dashboardPending } = useGetExamPortal();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { onSubmit, isPending: submitPending } = useSubmitAnswers(examId)
  const [isLoaded, setIsLoaded] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const { isFullscreen, enterFullscreen } = useAntiCheating();

  useEffect(() => {
    if (!dashboardPending && dashboardData) {
      // Check if this specific exam is already done
      const activeExam = dashboardData.active_exam;
      if (activeExam && activeExam.id === examId && activeExam.attempt?.submitted_at) {
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

  // Shuffling logic
  const processedData = useMemo(() => {
    if (!data || !data.questions) return undefined;

    const storageKey = `shuffled_exam_${examId}`;
    const savedShuffled = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;

    let shuffledQuestions: ShuffledTakeExamQuestionType[];

    if (savedShuffled) {
      try {
        const parsed = JSON.parse(savedShuffled);
        // Verify it matches the current data question count to be safe
        if (parsed.length === data.questions.length) {
          shuffledQuestions = parsed;
        } else {
          shuffledQuestions = shuffleQuestions(data.questions);
        }
      } catch (e) {
        shuffledQuestions = shuffleQuestions(data.questions);
      }
    } else {
      shuffledQuestions = shuffleQuestions(data.questions);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(shuffledQuestions));
    }

    return {
      ...data,
      questions: shuffledQuestions
    } as ShuffledTakeExamType;
  }, [data, examId]);

  function shuffleQuestions(questions: TakeExamQuestionType[]): ShuffledTakeExamQuestionType[] {
    // 1. Shuffle questions order
    const shuffled = shuffleArray([...questions]);
    
    // 2. Shuffle options for each question
    return shuffled.map(q => {
      const options = [
        { key: 'A', value: q.option_a },
        { key: 'B', value: q.option_b },
        { key: 'C', value: q.option_c },
        { key: 'D', value: q.option_d },
      ];
      
      const shuffledOptions = shuffleArray(options);
      
      return {
        ...q,
        option_a: shuffledOptions[0].value,
        option_b: shuffledOptions[1].value,
        option_c: shuffledOptions[2].value,
        option_d: shuffledOptions[3].value,
        _optionMapping: {
          A: shuffledOptions[0].key,
          B: shuffledOptions[1].key,
          C: shuffledOptions[2].key,
          D: shuffledOptions[3].key,
        }
      };
    });
  }

  const handleSelectOption = (questionId: number, displayedOption: string) => {
    // Map displayed option (A,B,C,D) back to original option key for backend
    const question = processedData?.questions.find(q => q.id === questionId);
    const originalOption = (question?._optionMapping as Record<string, string> | undefined)?.[displayedOption] || displayedOption;
    
    setAnswers(prev => ({ ...prev, [questionId]: originalOption }));
  };

  // Map original answers back to displayed answers for the UI
  const uiAnswers = useMemo(() => {
    const mapped: Record<number, string> = {};
    Object.entries(answers).forEach(([qId, originalOpt]) => {
      const questionId = Number(qId);
      const question = processedData?.questions.find(q => q.id === questionId);
      
      if (question?._optionMapping) {
        const displayedOpt = Object.entries(question._optionMapping).find(([_, orig]) => orig === originalOpt)?.[0];
        if (displayedOpt) mapped[questionId] = displayedOpt;
      } else {
        mapped[questionId] = originalOpt;
      }
    });
    return mapped;
  }, [answers, processedData]);

  const formattedAnswers = {
    answers: Object.entries(answers).map(([questionId, selected_option]) => ({
      question: Number(questionId),
      selected_option: selected_option ? selected_option.toLowerCase() : '',
    })),
  };

  useEffect(() => {
    if (examId) {
      const savedAnswers = localStorage.getItem(`exam_answers_${examId}`);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      setIsLoaded(true);
    }
  }, [examId]);

  useEffect(() => {
    if (examId && isLoaded) {
      localStorage.setItem(`exam_answers_${examId}`, JSON.stringify(answers));
    }
  }, [answers, examId, isLoaded]);

  async function handleSubmit() {
    try {
      await onSubmit(formattedAnswers);
      localStorage.removeItem(`exam_answers_${examId}`);
      localStorage.removeItem(`exam_current_question_${examId}`);
      localStorage.removeItem(`shuffled_exam_${examId}`);
    } catch (error) {
      console.error("Submission failed", error);
    }
  }

  const handleStartExam = async () => {
    await enterFullscreen();
    setExamStarted(true);
  };

  if (dashboardPending || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
      </div>
    );
  }

  if (!examStarted || !isFullscreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-2xl border border-gray-100">
          <div className="w-20 h-20 bg-[#3E4095]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3E4095]">
            <i className="fas fa-expand-arrows-alt text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-4">Secure Exam Environment</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This examination requires a secure, full-screen environment. 
            Once you start, switching tabs, taking screenshots, or exiting full-screen mode 
            will be flagged as suspicious activity.
          </p>
          <button 
            onClick={handleStartExam}
            className="px-10 py-5 bg-[#3E4095] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#3E4095]/20 hover:scale-105 transition-all active:scale-95"
          >
            Enter Fullscreen & Start Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamLayout 
      onTimeUp={handleSubmit} 
      timer={data?.countdown_minutes ?? 0} 
      deadline={data?.attempt?.deadline}
      title={data?.title}
    >
      <Questions 
        submitPending={submitPending} 
        handleSubmit={handleSubmit} 
        answers={uiAnswers} 
        onSelect={handleSelectOption} 
        isPending={isPending} 
        data={processedData} 
      />
    </ExamLayout>
  )
}

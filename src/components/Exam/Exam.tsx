"use client"
import { useParams, useRouter } from 'next/navigation';
import ExamLayout from './ExamLayout'
import Questions from './ExamQuestions'
import useCandidateTakeExam from '@/hooks/useCandidateTakeExam';
import { useState, useEffect, useMemo, useCallback } from 'react';
import useSubmitAnswers from '@/hooks/useSubmitAnswers';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import { toast } from 'react-toastify';
import { useAntiCheating } from '@/hooks/useAntiCheating';
import { useViolationManager } from '@/hooks/useViolationManager';
import { shuffleArray } from '@/utils/generalUtils';
import { TakeExamType, TakeExamQuestionType } from '@/types/Examtype';
import HelpdeskButton from '../General/Portal/DashboardParts/HelpdeskButton';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import clsx from 'clsx';
import { AxiosError } from 'axios';

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

  const [examStarted, setExamStarted] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { isPending, data, isError, error } = useCandidateTakeExam(examId, examStarted);
  const { data: dashboardData, isPending: dashboardPending } = useGetExamPortal();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { onSubmit, isPending: submitPending } = useSubmitAnswers(examId)
  const [isLoaded, setIsLoaded] = useState(false);

  const { reportViolation, registerScreenshotProvider, sendFinalHeartbeat } = useViolationManager(examId, data?.attempt?.started_at);

  const handleReturnToExam = useCallback(() => {
    // Refresh page as requested to reset environment and sync state
    window.location.reload();
  }, []);

  const { isFullscreen, enterFullscreen } = useAntiCheating(handleReturnToExam, reportViolation);
  const { user } = useGetCurrentUser();

  useEffect(() => {
    if (!dashboardPending && dashboardData && !isError) {
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
  }, [dashboardData, dashboardPending, examId, router, isError]);

  const candidateName = user
    ? `${user.first_name} ${user.last_name}`
    : "Candidate";

  const currentStage = dashboardData?.enrollment_stage_progress?.current_stage || 'SCREENING';

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
      } catch {
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
        const displayedOpt = Object.entries(question._optionMapping).find(([, orig]) => orig === originalOpt)?.[0];
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
      // Send final heartbeat before submitting - wrapped in try/catch to ensure submission proceeds even if proctoring fails
      try {
        await sendFinalHeartbeat();
      } catch (proctorError) {
        console.error("Final proctoring heartbeat failed, proceeding with submission anyway", proctorError);
      }

      await onSubmit(formattedAnswers);
      localStorage.removeItem(`exam_answers_${examId}`);
      localStorage.removeItem(`exam_current_question_${examId}`);
      localStorage.removeItem(`shuffled_exam_${examId}`);
      localStorage.removeItem(`vmlc_proctor_uuid`);
      localStorage.removeItem(`vmlc_proctor_seq_${examId}`);
      localStorage.removeItem(`vmlc_proctor_last_time_${examId}`);
    } catch (error) {
      console.error("Submission failed", error);
    }
  }

  const handleStartExam = async () => {
    await enterFullscreen();
    setExamStarted(true);
  };

  if (isError) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
    const status = axiosError?.response?.status;
    const detail = axiosError?.response?.data?.detail || axiosError?.response?.data?.message || "You cannot access this examination at this time.";

    if (status && status >= 400 && status < 599) {
      return (
        <div
          onClick={() => router.push('/exam-portal')}
          className="flex flex-col items-center justify-center min-h-screen bg-black/40 p-6 text-center backdrop-blur-sm fixed inset-0 z-9999 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-2xl border border-gray-100 cursor-default"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
              <i className="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-4">Session Unavailable</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {detail}
            </p>
            <button
              onClick={() => router.push('/exam-portal')}
              className="px-10 py-5 bg-[#3E4095] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#3E4095]/20 hover:scale-105 transition-all active:scale-95"
            >
              Return to Portal
            </button>
          </div>
        </div>
      );
    }
  }

  if (dashboardPending || (examStarted && isPending)) {
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
          <div className="text-left bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
            <p className="text-xs font-black text-[#3E4095] uppercase tracking-widest mb-4">Instructions & Rules:</p>
            <ul className="space-y-3">
              {[
                  "This examination requires a secure, full-screen environment.",
                  "Switching tabs or minimizing the browser is not allowed.",
                  "Exiting full-screen mode will be recorded as a suspicious activity.",
                  "Taking screenshots or screen captures will be flagged.",
                  "Do not exit the portal once your exam has started. Contact Helpdesk if you encounter an issue.",
                  "Ensure you are in a quiet environment and remain visible to the camera at all times.",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed font-medium">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#3E4095]/10 text-[#3E4095] flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8 cursor-pointer group" onClick={() => setIsAgreed(!isAgreed)}>
            <div className={clsx(
              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
              isAgreed ? "bg-[#3E4095] border-[#3E4095]" : "border-gray-300 group-hover:border-[#3E4095]"
            )}>
              {isAgreed && <i className="fas fa-check text-white text-xs"></i>}
            </div>
            <span className="text-sm font-bold text-gray-700 select-none">I understand and agree to the exam rules.</span>
          </div>

          <button
            disabled={!isAgreed}
            onClick={handleStartExam}
            className={clsx(
              "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
              isAgreed
                ? "bg-[#3E4095] text-white shadow-xl shadow-[#3E4095]/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
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
      reportViolation={reportViolation}
      registerScreenshotProvider={registerScreenshotProvider}
    >
      <div className="relative">
        <Questions
          submitPending={submitPending}
          handleSubmit={handleSubmit}
          answers={uiAnswers}
          onSelect={handleSelectOption}
          isPending={isPending}
          data={processedData}
        />

        {/* PERSISTENT ACTIONS - HELPDESK */}
        <HelpdeskButton
            currentStage={currentStage}
            candidateName={candidateName}
            exam_id={examId}
        />
      </div>
    </ExamLayout>
  )
}

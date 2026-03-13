import React, { useState, useEffect, useRef } from 'react';
import { AvailableExamType } from '@/types/Examtype';
import { useRouter } from 'next/navigation';
import { formatExamTitle } from '@/utils/generalUtils';
import CaptureDialog from '@/components/General/BioVerification/CaptureDialog';
import useUploadExamFaceCapture from '@/hooks/useUploadExamFaceCapture';

interface PrimaryActionProps {
  exam: AvailableExamType | null;
  candidateName: string;
  isRankingAvailable?: boolean;
  isEliminated?: boolean;
  onCountdownEnd?: () => void;
}

const TimeUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
  <div className="flex items-baseline space-x-0.5">
    <span className="font-mono text-lg font-bold text-[#3E4095]">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-[10px] uppercase tracking-tighter text-[#98A2B3] font-bold">
      {unit.charAt(0)}
    </span>
  </div>
);

const PrimaryAction: React.FC<PrimaryActionProps> = ({ exam, isRankingAvailable = false, isEliminated = false, onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [canStart, setCanStart] = useState(false);
  const router = useRouter();
  const hasRefetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!exam) return;

    if (exam.status === 'awaiting_results' || exam.status === 'results_published' || exam.status === 'concluded') {
      setCanStart(false);
      setTimeLeft(null);
      return;
    }

    // Determine target date: either the deadline (if started) or the scheduled start date (if upcoming)
    const getTargetDate = () => {
      if (exam.access_status === 'started' && exam.attempt?.deadline) {
        const deadline = new Date(exam.attempt.deadline);
        if (deadline > new Date()) return deadline;
      }

      if (exam.scheduled_date) {
        const scheduled = new Date(exam.scheduled_date);
        if (scheduled > new Date()) return scheduled;
      }

      return null;
    };

    const targetDate = getTargetDate();

    if (!targetDate) {
      if (exam.status === 'ongoing' || exam.access_status === 'started') {
        setCanStart(true);
      }
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCanStart(true);
        setTimeLeft(null);
        if (onCountdownEnd && hasRefetchedFor.current !== exam.id) {
          hasRefetchedFor.current = exam.id;
          setTimeout(onCountdownEnd, 500);
        }
        return true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return false;
    };

    const finished = updateTimer();
    if (finished) return;

    const timer = setInterval(() => {
      const isFinished = updateTimer();
      if (isFinished) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, onCountdownEnd]);

  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const { uploadFace, isPending: isUploading, isSuccess: isUploadSuccess } = useUploadExamFaceCapture();

  useEffect(() => {
    if (isUploadSuccess && exam) {
      router.push(`/exam-portal/${exam.id}/exam`);
    }
  }, [isUploadSuccess, exam, router]);

  const handleStartExam = () => {
    if (exam && canEnter && !isFinals) {
      if (exam.access_status === 'started') {
        router.push(`/exam-portal/${exam.id}/exam`);
      } else {
        setIsCaptureOpen(true);
      }
    }
  };

  const handleCaptureFile = (file: File) => {
    if (exam) {
      uploadFace({ examId: exam.id, file });
    }
  };

  const isFinals = exam?.stage?.toLowerCase() === 'final';
  const hasSubmitted = exam?.access_status === "submitted" || !!exam?.attempt?.submitted_at;
  const isAwaitingResults = exam?.status === 'awaiting_results' && !isRankingAvailable;
  const isOngoing = exam?.status === 'ongoing';
  const isResultsPublished = exam?.status === 'results_published';
  // const isDeadlinePassed = exam?.attempt?.deadline ? new Date(exam.attempt.deadline) <= new Date() : false;
  const isDeadlineActive = exam?.attempt?.deadline ? new Date(exam.attempt.deadline) > new Date() : false;
  const canEnter = (isOngoing || isDeadlineActive) && !hasSubmitted && exam?.access_status !== "expired" && exam?.access_status !== "failed"

  if (!exam) {
     return (
        <section className="font-sans bg-white p-8 rounded-[24px] border border-[#E4E7EC] shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isEliminated ? 'bg-red-50 text-red-600' : 'bg-[#F0F2F5] text-[#475367]'}`}>
            {isEliminated ? 'Competition Status' : 'Exam Status'}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            {isEliminated ? 'Better luck next time!' : 'Awaiting challenge...'}
          </h2>
          <p className="text-[#667185] mt-2 text-sm leading-relaxed">
            {isEliminated
              ? "You didn't make the cut for the next stage this time, but we're rooting for you in your future endeavors!"
              : "You'll be notified if anything changes"}
          </p>
        </div>
      </section>
     )
  }

  return (
    <section className="bg-white p-8 rounded-[24px] border border-[#E4E7EC] shadow-sm text-center font-sans">
      <div className="max-w-md mx-auto">
        <span className="bg-[#EBEBF5] text-[#3E4095] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {isFinals ? 'On-site Finals' : 'Next Exam'}
        </span>
        <h2 className="text-2xl font-bold text-slate-800 mt-3">
          {formatExamTitle(exam.title)}
        </h2>
        <p className="text-[#667185] mt-2 text-[11px] italic leading-relaxed">
          {isFinals
            ? "This is an in-person examination. Please ensure you have reviewed the venue logistics and have your identification ready."
            : isAwaitingResults
              ? "Currently processing the results... Please check back soon."
              : (exam.description || "")}
        </p>

        <div className="mt-8 space-y-4">
          {hasSubmitted || exam.access_status === "expired" || isAwaitingResults || isResultsPublished ? (
             <div className="p-4 bg-[#3E4095]/2 rounded-xl border border-[#3E4095]/20">
              <p className="text-xs font-bold text-[#3E4095] uppercase">Status</p>
              <p className="text-lg font-bold text-[#3E4095] mt-1">
                {isAwaitingResults || isResultsPublished ? 'Concluded' : hasSubmitted ? 'Submitted' : 'Access Expired'}
              </p>
            </div>
          ) : !canEnter ? (
            <div className="p-4 bg-[#F8F9FA] rounded-xl border border-[#E4E7EC] flex flex-col items-center">
              <p className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-widest mb-2">Opens in</p>
              <div className="flex items-center gap-3">
                {timeLeft ? (
                  <>
                    <TimeUnit value={timeLeft.days} unit="Days" />
                    <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                    <TimeUnit value={timeLeft.hours} unit="Hrs" />
                    <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                    <TimeUnit value={timeLeft.minutes} unit="Mins" />
                    <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                    <TimeUnit value={timeLeft.seconds} unit="Secs" />
                  </>
                ) : (
                  <div className="flex items-baseline space-x-1 animate-pulse">
                    <span className="text-sm font-bold text-[#3E4095]">Please hang on...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
             <div className={`p-4 rounded-xl border ${exam.access_status === 'started' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
              <p className={`text-xs font-bold uppercase ${exam.access_status === 'started' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {exam.access_status === 'started' ? 'Time Remaining' : 'Status'}
              </p>
              {exam.access_status === 'started' && timeLeft ? (
                <div className="flex items-center justify-center gap-3 mt-1">
                  {timeLeft.days > 0 && (
                    <>
                      <TimeUnit value={timeLeft.days} unit="Days" />
                      <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                    </>
                  )}
                  <TimeUnit value={timeLeft.hours} unit="Hrs" />
                  <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                  <TimeUnit value={timeLeft.minutes} unit="Mins" />
                  <div className="text-[#3E4095] font-bold self-start mt-[-2px]">:</div>
                  <TimeUnit value={timeLeft.seconds} unit="Secs" />
                </div>
              ) : (
                <p className={`text-lg font-bold mt-1 ${exam.access_status === 'started' ? 'text-amber-800' : 'text-emerald-800'}`}>
                  {isFinals ? 'Exam Session Active at Venue' : 'Exam is Ongoing!'}
                </p>
              )}
            </div>
          )}

          {exam.access_status !== 'expired' && (
            <button
              disabled={!canEnter || isFinals}
              onClick={handleStartExam}
              className={`w-full py-4 rounded-xl font-bold transition-all uppercase tracking-wider ${
                canEnter && !isFinals
                  ? 'bg-[#3E4095] text-white hover:bg-[#4A4DA8] shadow-lg transform hover:scale-[1.02] cursor-pointer'
                  : 'bg-[#F0F2F5] text-[#98A2B3] cursor-not-allowed'
              }`}
            >
              {isFinals
                ? 'View Venue Logistics'
                : hasSubmitted
                  ? 'SUBMITTED'
                  : exam.access_status === 'started'
                    ? 'RESUME EXAM'
                    : 'START EXAM'}
            </button>
          )}
          {!hasSubmitted && !isAwaitingResults && (
            <p className="text-xs text-[#98A2B3] italic font-medium">
              {isFinals
                ? 'Venue details wilFl be fully accessible when the window opens.'
                : !canStart
                  ? "The start button enables when it's exam time."
                  : exam.access_status === 'pending'
                    ? "Click 'START EXAM' to begin your session. Your timer will start immediately."
                    : exam.access_status === 'started'
                      ? "Resume your exam before your time runs out. Good luck!"
                      : ""}
            </p>
          )}
          {hasSubmitted && (
            <p className="text-xs text-[#3E4095] italic font-medium">
              {isAwaitingResults
                ? 'Ranking will be published shortly.'
                : 'You have successfully completed this examination. Well done!'}
            </p>
          )}
          {exam.access_status === 'expired' && !hasSubmitted && (
            <p className="text-xs text-red-500 italic font-medium">
              You&apos;re no longer eligible and the exam window is now closed
            </p>
          )}
        </div>
      </div>

      {exam && (
        <CaptureDialog
          open={isCaptureOpen}
          close={setIsCaptureOpen}
          onCaptureFile={handleCaptureFile}
          isPending={isUploading}
        />
      )}
    </section>
  );
};

export default PrimaryAction;
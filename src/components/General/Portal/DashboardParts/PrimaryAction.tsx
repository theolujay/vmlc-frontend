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

const PrimaryAction: React.FC<PrimaryActionProps> = ({ exam, isRankingAvailable = false, onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [canStart, setCanStart] = useState(false);
  const router = useRouter();
  const hasRefetchedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!exam || !exam.scheduled_date) return;

    if (exam.status === 'ongoing') {
      setCanStart(true);
      setTimeLeft(null);
      return;
    }

    if (exam.status === 'awaiting_results') {
      setCanStart(false);
      return;
    }

    const targetDate = new Date(exam.scheduled_date);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCanStart(true);
        setTimeLeft(null);
        if (onCountdownEnd && hasRefetchedFor.current !== exam.id) {
          hasRefetchedFor.current = exam.id;
          setTimeout(onCountdownEnd, 2000);
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
  const hasParticipated = exam?.access_status === 'submitted' || !!exam?.attempt?.submitted_at;
  const isAwaitingResults = exam?.status === 'awaiting_results' && !isRankingAvailable;
  const isOngoing = exam?.status === 'ongoing';
  const isDeadlineActive = exam?.attempt?.deadline ? new Date(exam.attempt.deadline) > new Date() : false;
  const canEnter = (isOngoing || isDeadlineActive) && !hasParticipated;

  if (!exam) {
     return (
        <section className="font-sans bg-white p-8 rounded-[24px] border border-[#E4E7EC] shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <span className="bg-[#F0F2F5] text-[#475367] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Exam Status
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            Awaiting challenge...
          </h2>
          <p className="text-[#667185] mt-2 text-sm leading-relaxed">
            You&apos;ll be notified if anything changes
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
          {hasParticipated ? (
             <div className="p-4 bg-[#3E4095]/2 rounded-xl border border-[#3E4095]/20">
              <p className="text-xs font-bold text-[#3E4095] uppercase">Status</p>
              <p className="text-lg font-bold text-[#3E4095] mt-1">
                {isAwaitingResults || exam.status === 'results_published' ? 'Exam Concluded' : 'Exam Submitted'}
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
                    <span className="text-sm font-bold text-[#3E4095]">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
             <div className={`p-4 rounded-xl border bg-emerald-50 border-emerald-200`}>
              <p className={`text-xs font-bold uppercase text-emerald-600`}>Status</p>
              <p className={`text-lg font-bold mt-1 text-emerald-800`}>
                {isFinals ? 'Exam Session Active at Venue' : 'Exam is Open!'}
              </p>
            </div>
          )}
          
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
               : hasParticipated 
                 ? 'SUBMITTED' 
                 : exam.access_status === 'started'
                   ? 'RESUME EXAM'
                   : 'START EXAM'}
          </button>
          
          {!canStart && !hasParticipated && !isAwaitingResults && (
             <p className="text-xs text-[#98A2B3] italic font-medium">
                {isFinals ? 'Venue details will be fully accessible when the window opens.' : 'The start button enables when it\'s exam time.'}
             </p>
          )}
          {hasParticipated && (
            <p className="text-xs text-[#3E4095] italic font-medium">
                {isAwaitingResults ? 'Ranking will be published shortly.' : 'You have successfully completed this examination.'}
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
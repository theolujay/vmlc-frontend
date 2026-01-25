import React, { useState, useEffect } from 'react';
import { AvailableExamType } from '@/types/Examtype';

interface PrimaryActionProps {
  exam: AvailableExamType | null;
  candidateName: string;
}

const PrimaryAction: React.FC<PrimaryActionProps> = ({ exam, candidateName }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    if (!exam || !exam.scheduled_date) return;

    const targetDate = new Date(exam.scheduled_date);
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCanStart(true);
        setTimeLeft('Now');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`);
      } else {
        setTimeLeft(`${minutes} minute${minutes > 1 ? 's' : ''}`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); 

    return () => clearInterval(timer);
  }, [exam]);

  const isFinals = exam?.stage?.toLowerCase() === 'final';

  if (!exam) {
     return (
        <section className="bg-white p-8 rounded-[24px] border border-[#E4E7EC] shadow-sm text-center">
        <div className="max-w-md mx-auto">
          <span className="bg-[#F0F2F5] text-[#475367] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Exam Status
          </span>
          <h2 className="text-2xl font-bold text-slate-800 mt-3">
            Awaiting Challenge...
          </h2>
          <p className="text-[#667185] mt-2 text-sm leading-relaxed">
            We are preparing for you, {candidateName}. You&apos;ll be duly notified.
          </p>
        </div>
      </section>
     )
  }

  return (
    <section className="bg-white p-8 rounded-[24px] border border-[#E4E7EC] shadow-sm text-center font-sans">
      <div className="max-w-md mx-auto">
        <span className="bg-[#EBEBF5] text-[#3E4095] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {isFinals ? 'On-site Finals' : 'Upcoming Exam'}
        </span>
        <h2 className="text-2xl font-bold text-slate-800 mt-3">
          {exam.title}
        </h2>
        <p className="text-[#667185] mt-2 text-sm leading-relaxed">
          {isFinals 
            ? "This is an in-person examination. Please ensure you have reviewed the venue logistics and have your identification ready."
            : (exam.description || "Ensure you are in a quiet environment with a stable internet connection for this virtual exam.")}
        </p>
        
        <div className="mt-8 space-y-4">
          {!canStart ? (
            <div className="p-4 bg-[#] rounded-xl border border-[#3E4095]">
              <p className="text-xs font-bold text-[#475367] uppercase">Countdown</p>
              <p className="text-lg font-bold text-[#3E4095] mt-1">Opens in: {timeLeft}</p>
            </div>
          ) : (
             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs font-bold text-emerald-600 uppercase">Status</p>
              <p className="text-lg font-bold text-emerald-800 mt-1">
                {isFinals ? 'Exam Session Active at Venue' : 'Exam is Open!'}
              </p>
            </div>
          )}
          
          <button 
            disabled={!canStart || isFinals}
            className={`w-full py-4 rounded-xl font-bold transition-all uppercase tracking-wider ${
              canStart && !isFinals
                ? 'bg-[#3E4095] text-white hover:bg-[#4A4DA8] shadow-lg transform hover:scale-[1.02]' 
                : 'bg-[#F0F2F5] text-[#98A2B3] cursor-not-allowed'
            }`}
          >
            {isFinals 
               ? 'View Venue Logistics' 
               : canStart ? `START ${exam.stage_display || 'EXAM'}` : `START ${exam.stage_display || 'EXAM'}`}
          </button>
          
          {!canStart && (
             <p className="text-xs text-[#98A2B3] italic font-medium">
                {isFinals ? 'Venue details will be fully accessible when the window opens.' : 'The start button enables when it\'s exam time.'}
             </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrimaryAction;

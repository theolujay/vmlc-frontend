import React from 'react';
import Link from 'next/link';
import { CandidatePerformanceIcon } from '@/components/General/GeneralIcon';
import { GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';

type ExamStage = 'SCREENING' | 'LEAGUE' | 'FINAL';

interface PerformanceSnapshotProps {
  rank: number;
  totalCandidates: number;
  stage: ExamStage;
  currentWeek?: number; // Only for League stage (1-6)
  qualificationThreshold?: number;
}

const PerformanceSnapshot: React.FC<PerformanceSnapshotProps> = ({ 
  rank, 
  totalCandidates, 
  stage,
  currentWeek = 1,
  qualificationThreshold = 20 
}) => {
  const isQualified = rank <= qualificationThreshold;

  const stageConfig = {
    SCREENING: {
      title: "Screening Phase",
      metricLabel: "Qualification Target",
      successLabel: "Promotion Ready",
      successSub: "You are currently in the league promotion zone.",
      failLabel: "Below Cut-off",
      failSub: "Boost your score to secure a League spot.",
      accent: "#01ACEA"
    },
    LEAGUE: {
      title: `League Stage • Week ${currentWeek}/6`,
      metricLabel: "Finalist Cut-off",
      successLabel: "Finals Contender",
      successSub: "Maintaining this rank secures your Finalist spot.",
      failLabel: "At Risk",
      failSub: "Consistent high scores needed to stay in.",
      accent: "#3E4095"
    },
    FINAL: {
      title: "The Grand Finale",
      metricLabel: "Top Finalists",
      successLabel: "Elite Finalist",
      successSub: "You are cleared for the in-person examination.",
      failLabel: "Review Required",
      failSub: "Check with coordinators regarding your final status.",
      accent: "#099137"
    }
  };

  const currentContent = stageConfig[stage] || stageConfig.SCREENING;

  return (
    <section className="bg-white p-6 rounded-[24px] border border-[#E4E7EC] shadow-sm h-full flex flex-col font-sans">
      <div className="flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
                <span style={{ color: currentContent.accent }}>
                    <CandidatePerformanceIcon />
                </span>
                <span className='text-[#475367] text-sm font-bold uppercase tracking-wide'>
                    {currentContent.title}
                </span>
            </div>
            {stage === 'LEAGUE' && (
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((w) => (
                        <div 
                            key={w} 
                            className={`w-1.5 h-1.5 rounded-full ${w < currentWeek ? 'bg-emerald-500' : w === currentWeek ? 'bg-[#3E4095] animate-pulse' : 'bg-slate-200'}`}
                        />
                    ))}
                </div>
            )}
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="flex flex-col gap-1">
                <span className="text-[#475367] text-xs font-bold uppercase">Current Rank</span>
                <span className="font-bold text-[#101828] text-3xl">
                    {rank} <span className="text-base font-normal text-[#667185]">/ {totalCandidates}</span>
                </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[#475367] text-xs font-bold uppercase">
                    {currentContent.metricLabel}
                </span>
                <span className="font-bold text-[#101828] text-3xl">Top {qualificationThreshold}</span>
            </div>
        </div>

        {/* Status Banner */}
         <div className={`p-4 rounded-xl border flex items-center gap-3 mt-2 transition-all duration-300 ${
            isQualified ? 'bg-[#] border-[#01ACEA]/50' : 'bg-[#FBEAE9] border-[#CB1A14]/20'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isQualified ? 'bg-[#01ACEA]' : 'bg-[#CB1A14]'
          }`}>
            {isQualified ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )}
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider ${
                 isQualified ? 'text-[#018ABB]' : 'text-[#CB1A14]'
            }`}>
                {isQualified ? currentContent.successLabel : currentContent.failLabel}
            </p>
            <p className="text-[11px] text-[#475367] leading-tight mt-0.5">
                {isQualified ? currentContent.successSub : currentContent.failSub}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <Link href="/exam-portal/leaderboard" className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all">
        <span>Leaderboard</span>
        <GotoIcon />
      </Link>
    </section>
  );
};

export default PerformanceSnapshot;
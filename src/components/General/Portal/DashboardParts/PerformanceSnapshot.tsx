import React from 'react';
import Link from 'next/link';
import { CandidatePerformanceIcon } from '@/components/General/GeneralIcon';
import { GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import { LeaderboardRankingType } from '@/types/Examtype';

type ExamStage = 'SCREENING' | 'LEAGUE' | 'FINAL';

interface PerformanceSnapshotProps {
  leagueRanking?: LeaderboardRankingType | null;
  screeningRanking?: LeaderboardRankingType | null;
  stage: ExamStage;
  currentWeek?: number; // Only for League stage (1-6)
  qualificationThreshold?: number;
  hasTakenExam?: boolean;
  isQualified?: boolean;
  qualificationMessage?: string;
}

const PerformanceSnapshot: React.FC<PerformanceSnapshotProps> = ({ 
  leagueRanking, 
  screeningRanking, 
  stage,
  currentWeek = 1,
  qualificationThreshold,
  hasTakenExam = false,
  isQualified: isQualifiedFromApi,
  qualificationMessage
}) => {
  const activeRanking = stage === 'SCREENING' ? screeningRanking : leagueRanking;
  const rank = activeRanking?.position || 0;
  const totalCandidates = activeRanking?.total_candidates || 0;

  // Use API value if available, otherwise fallback to calculation
  const isQualified = isQualifiedFromApi !== undefined ? isQualifiedFromApi : (qualificationThreshold ? rank <= qualificationThreshold && rank > 0 : false);

  const stageConfig = {
    SCREENING: {
      title: "Screening Performance",
      metricLabel: "Screening Cut-off Range",

      pendingLabel: "Screening Upcoming",
      pendingSub: "The screening examination hasn't yet commenced. Please await updates.",

      successLabel: "Screening Passed",
      successSub: "You are eligible to proceed to the League stage once it begins.",

      failLabel: "Screening Not Passed",
      failSub: "Your score did not meet the required cut-off for progression.",

      accent: "#01ACEA"
    },

    LEAGUE: {
      title: `League Performance • Week ${currentWeek} of 6`,
      metricLabel: "Finalist Qualification Cut-off",

      pendingLabel: "Week Assessment Pending",
      pendingSub: `The assessment for Week ${currentWeek} has not started yet. Prepare well!`,

      successLabel: "Within Qualification Range",
      successSub: "Maintaining this position keeps you eligible for the Final stage.",

      failLabel: "Outside Qualification Range",
      failSub: "Improved performance is required in upcoming weeks to qualify.",

      accent: "#3E4095"
    },

    FINAL: {
      title: "Final Stage",
      metricLabel: "Finalist Status",

      pendingLabel: "Finals Upcoming",
      pendingSub: "The final examination schedule and details will be shared soon.",

      successLabel: "Finalist Confirmed",
      successSub: "You are cleared to participate in the in-person final examination.",

      failLabel: "Final Status Pending",
      failSub: "Your participation requires further review by the organizers.",

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
                    {hasTakenExam && rank > 0 ? rank : '-'} <span className="text-base font-normal text-[#667185]">/ {totalCandidates}</span>
                </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[#475367] text-xs font-bold uppercase">
                    {currentContent.metricLabel}
                </span>
                <span className="font-bold text-[#101828] text-3xl">{qualificationThreshold ? `Top ${qualificationThreshold}` : '-'}</span>
            </div>
        </div>

        {/* Status Banner */}
         <div className={`p-4 rounded-xl border flex items-center gap-3 mt-2 transition-all duration-300 ${
            !hasTakenExam ? 'bg-gray-50 border-gray-200' : isQualified ? 'bg-[#CCEEFB]/30 border-[#01ACEA]/50' : 'bg-[#FBEAE9] border-[#CB1A14]/20'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              !hasTakenExam ? 'bg-gray-400' : isQualified ? 'bg-[#01ACEA]' : 'bg-[#CB1A14]'
          }`}>
            {!hasTakenExam ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : isQualified ? (
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
                 !hasTakenExam ? 'text-gray-500' : isQualified ? 'text-[#018ABB]' : 'text-[#CB1A14]'
            }`}>
                {!hasTakenExam ? currentContent.pendingLabel : isQualified ? currentContent.successLabel : currentContent.failLabel}
            </p>
            <p className="text-[11px] text-[#475367] leading-tight mt-0.5">
                {qualificationMessage || (!hasTakenExam ? currentContent.pendingSub : isQualified ? currentContent.successSub : currentContent.failSub)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <Link href="/exam-portal/leaderboard" className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all">
        <span>{stage === 'SCREENING' ? 'Standings' : 'Leaderboard'}</span>
        <GotoIcon />
      </Link>
    </section>
  );
};

export default PerformanceSnapshot;
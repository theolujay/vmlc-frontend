import React from 'react';
import Link from 'next/link';
import { CandidatePerformanceIcon } from '@/components/General/GeneralIcon';
import { GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import { LeaderboardRankingType } from '@/types/Examtype';

type ExamStage = 'SCREENING' | 'LEAGUE' | 'FINAL';

const STAGE_CONFIG = {
  SCREENING: {
    title: "Screening Performance",
    metricLabel: "Screening Cut-off Range",
    pendingLabel: "Screening Upcoming",
    pendingSub: "The screening examination hasn't yet commenced. Please await updates.",
    awaitingLabel: "Awaiting Results",
    awaitingSub: "Your performance is being processed. Results will be available soon.",
    successLabel: "Screening Passed",
    successSub: "You are eligible for promotion to the League stage.",
    failLabel: "Screening Not Passed",
    failSub: "Your score did not meet the required cut-off for promotion.",
    accent: "#01ACEA"
  },
  LEAGUE: {
    title: (round: number, total: number) => `League Performance • Round ${round} of ${total}`,
    metricLabel: "Finalist Qualification Cut-off",
    pendingLabel: "Round Assessment Pending",
    pendingSub: (round: number) => `The assessment for Round ${round} has not started yet. Prepare well!`,
    awaitingLabel: "Results Pending",
    awaitingSub: "The leaderboard is currently being updated with the latest scores. Check back soon.",
    successLabel: "Within Qualification Range",
    successSub: "Maintaining this position keeps you eligible for the Final stage.",
    failLabel: "Outside Qualification Range",
    failSub: "Improved performance is advised in upcoming rounds to reach Final stage.",
    accent: "#3E4095"
  },
  FINAL: {
    title: "Final Stage",
    metricLabel: "Finalist Status",
    pendingLabel: "Finals Upcoming",
    pendingSub: "The final examination schedule and details will be shared soon.",
    awaitingLabel: "Under Review",
    awaitingSub: "Final results are being verified. An official announcement will follow shortly.",
    successLabel: "Finalist Confirmed",
    successSub: "You are cleared to participate in the in-person final examination.",
    failLabel: "Final Status Pending",
    failSub: "Your participation requires further review by the organizers.",
    accent: "#099137"
  }
};

interface PerformanceSnapshotProps {
  leagueRanking?: LeaderboardRankingType | null;
  screeningRanking?: LeaderboardRankingType | null;
  finalRanking?: LeaderboardRankingType | null;
  stage: ExamStage;
  leagueRound?: number; // Current round in League stage
  totalRounds?: number; // Total rounds in League stage
  qualificationThreshold?: number;
  cutoffDisplay?: string;
  hasTakenExam?: boolean;
  isQualified?: boolean;
  isAwaitingResults?: boolean;
  isActive?: boolean;
  qualificationMessage?: string;
  onViewLeaderboard?: () => void;
}

const Performance: React.FC<PerformanceSnapshotProps> = ({ 
  leagueRanking, 
  screeningRanking, 
  finalRanking,
  stage,
  leagueRound = 1,
  totalRounds = 6,
  qualificationThreshold,
  cutoffDisplay,
  hasTakenExam = false,
  isQualified: isQualifiedFromApi,
  isAwaitingResults = false,
  isActive = true,
  onViewLeaderboard}) => {
  const activeRanking = stage === 'SCREENING' ? screeningRanking : stage === 'FINAL' ? finalRanking : leagueRanking;
  const rank = activeRanking?.position || 0;
  const totalCandidates = activeRanking?.total_candidates || 0;
  
  // For League, use isActive to determine if rank is finalized
  const showRank = rank > 0 && (stage !== 'LEAGUE' || isActive);

  // Use API value if available, otherwise fallback to calculation
  const isQualified = isQualifiedFromApi !== undefined ? isQualifiedFromApi : (qualificationThreshold ? rank <= qualificationThreshold && rank > 0 : false);

  const displayCutoff = cutoffDisplay || (qualificationThreshold ? `Top ${qualificationThreshold}` : '-');

  const currentContent = STAGE_CONFIG[stage];
  const isLinkDisabled = !activeRanking || ((stage === 'SCREENING' || stage === 'FINAL') && !activeRanking.exam_id);

  const title = stage === 'LEAGUE' 
    ? STAGE_CONFIG.LEAGUE.title(leagueRound, totalRounds)
    : currentContent.title;

  const pendingSub = stage === 'LEAGUE'
    ? STAGE_CONFIG.LEAGUE.pendingSub(leagueRound)
    : currentContent.pendingSub;

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
                    {title}
                </span>
            </div>
            {stage === 'LEAGUE' && (
                <div className="flex gap-1">
                    {Array.from({ length: totalRounds }).map((_, i) => {
                        const w = i + 1;
                        return (
                            <div 
                                key={w} 
                                className={`w-1.5 h-1.5 rounded-full ${w < leagueRound ? 'bg-emerald-500' : w === leagueRound ? 'bg-[#3E4095] animate-pulse' : 'bg-slate-200'}`}
                            />
                        );
                    })}
                </div>
            )}
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
             <div className="flex flex-col gap-1">
                <span className="text-[#475367] text-xs font-bold uppercase">Current Rank</span>
                <div className="flex items-end gap-2">
                    <span className="font-bold text-[#101828] text-3xl">
                        {showRank ? rank : '-'} <span className="text-base font-normal text-[#667185]">/ {totalCandidates > 0 ? totalCandidates : '-'}</span>
                    </span>
                    {hasTakenExam && activeRanking?.rank_change !== undefined && activeRanking.rank_change !== 0 && showRank && (
                        <div className={`flex items-center mb-1.5 text-xs font-bold ${activeRanking.rank_change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                             {activeRanking.rank_change > 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                             )}
                             <span>{Math.abs(activeRanking.rank_change)}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[#475367] text-xs font-bold uppercase">
                    {currentContent.metricLabel}
                </span>
                <span className="font-bold text-[#101828] text-3xl">{displayCutoff}</span>
            </div>
        </div>

        {/* Secondary Statistics (Score/Percentile) */}
        {hasTakenExam && (activeRanking?.score !== undefined || activeRanking?.percentile !== undefined) && (
            <div className="flex items-center gap-6 mt-1 pb-2 border-b border-slate-50">
                {activeRanking?.score !== undefined && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-tight">Total Score</span>
                        <span className="text-sm font-bold text-[#475367]">{activeRanking.score.toLocaleString()} pts</span>
                    </div>
                )}
                {activeRanking?.percentile !== undefined && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-tight">Percentile</span>
                        <span className="text-sm font-bold text-[#475367]">{activeRanking.percentile.toFixed(1)}%</span>
                    </div>
                )}
            </div>
        )}

        {/* Status Banner */}
         <div className={`p-4 rounded-xl border flex items-center gap-3 mt-2 transition-all duration-300 ${
            !hasTakenExam ? 'bg-gray-50 border-gray-200' : isAwaitingResults ? 'bg-blue-50/50 border-blue-100' : isQualified ? 'bg-[#CCEEFB]/30 border-[#01ACEA]/50' : 'bg-[#FBEAE9] border-[#CB1A14]/20'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              !hasTakenExam ? 'bg-gray-400' : isAwaitingResults ? 'bg-emerald-800' : isQualified ? 'bg-[#01ACEA]' : 'bg-[#CB1A14]'
          }`}>
            {!hasTakenExam || isAwaitingResults ? (
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
                 !hasTakenExam ? 'text-gray-500' : isAwaitingResults ? 'text-emerald-800' : isQualified ? 'text-[#018ABB]' : 'text-[#CB1A14]'
            }`}>
                {!hasTakenExam ? currentContent.pendingLabel : isAwaitingResults ? currentContent.awaitingLabel : isQualified ? currentContent.successLabel : currentContent.failLabel}
            </p>
            <p className="text-[11px] text-[#475367] leading-tight mt-0.5">
                {!hasTakenExam ? pendingSub : isAwaitingResults ? currentContent.awaitingSub : isQualified ? currentContent.successSub : currentContent.failSub}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      {!isLinkDisabled ? (
        stage === 'LEAGUE' && onViewLeaderboard ? (
          <button 
            onClick={onViewLeaderboard}
            className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all w-full text-left"
          >
            <span>Leaderboard</span>
            <GotoIcon />
          </button>
        ) : (
          <Link 
            href={activeRanking?.exam_id ? `/exam-portal/rankings/${activeRanking.exam_id}` : "/exam-portal/leaderboard"} 
            className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all"
          >
            <span>{stage === 'SCREENING' ? 'Ranking' : 'Leaderboard'}</span>
            <GotoIcon />
          </Link>
        )
      ) : (
        <div className="mt-6 pt-4 border-t border-slate-100 text-sm font-bold text-slate-300 flex items-center justify-between cursor-not-allowed grayscale">
          <span>{stage === 'SCREENING' ? 'Ranking' : 'Leaderboard'}</span>
          <GotoIcon />
        </div>
      )}
    </section>
  );
};

export default Performance;
import React from 'react';
import Link from 'next/link';
import { CandidatePerformanceIcon } from '@/components/General/GeneralIcon';
import { GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import { PerformanceActiveContext } from '@/types/Examtype';

interface PerformanceSnapshotProps {
  context?: PerformanceActiveContext;
  leagueRound?: number; // Current round in League stage
  totalRounds?: number; // Total rounds in League stage
  onViewLeaderboard?: () => void;
}

const Performance: React.FC<PerformanceSnapshotProps> = ({
  context,
  leagueRound = 1,
  totalRounds = 6,
  onViewLeaderboard
}) => {
  if (!context) {
    return (
      <section className="bg-white p-6 rounded-[24px] border border-[#E4E7EC] shadow-sm h-[310px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
           <div className="w-12 h-12 bg-slate-100 rounded-full" />
           <div className="w-32 h-4 bg-slate-100 rounded" />
        </div>
      </section>
    );
  }

  const { stage, stage_display, title, accent_color, ranking, status_meta } = context;
  const rank = ranking?.position || 0;
  const totalCandidates = ranking?.total_candidates || 0;
  const isLeague = stage?.toLowerCase().includes('league');
  // Logic to determine if we should show the rank (active rank or finalized)
  const showRank = rank > 0 && (!isLeague || ranking?.is_active);
  const isScreening = stage?.toLowerCase().includes('screening');
  const isFinal = stage?.toLowerCase().includes('final');
  // Link is enabled if:
  // 1. It's the League stage (always has a leaderboard)
  // 2. It's the Screening or Final stage AND we have an exam_id to link to
  const isLinkEnabled = isLeague || ((isScreening || isFinal) && !!ranking?.exam_id);

  return (
    <section className="bg-white p-6 rounded-[24px] border border-[#E4E7EC] shadow-sm min-h-[310px] flex flex-col font-sans">
      <div className="flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
                <span style={{ color: accent_color }}>
                    <CandidatePerformanceIcon />
                </span>
                <span className='text-[#475367] text-sm font-bold uppercase tracking-wide'>
                    {title || stage_display}
                </span>
            </div>
            {isLeague && (
                <div className="flex gap-1">
                    {Array.from({ length: totalRounds }).map((_, i) => {
                        const w = i + 1;
                        return (
                            <div
                                key={w}
                                className={`w-1.5 h-1.5 rounded-full ${w < leagueRound ? 'bg-emerald-500' : w === leagueRound ? 'animate-pulse' : 'bg-slate-200'}`}
                                style={{ backgroundColor: w === leagueRound ? accent_color : undefined }}
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
                    {ranking?.rank_change !== undefined && ranking.rank_change !== 0 && showRank && (
                        <div className={`flex items-center mb-1.5 text-xs font-bold ${ranking.rank_change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                             {ranking.rank_change > 0 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                             )}
                             <span>{Math.abs(ranking.rank_change)}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[#475367] text-xs font-bold uppercase">
                    {status_meta.metric_label}
                </span>
                <span className="font-bold text-[#101828] text-3xl">{status_meta.metric_value_display}</span>
            </div>
        </div>

        {/* Secondary Statistics (Score/Percentile) */}
        {(ranking?.score != null || ranking?.percentile != null) && (
            <div className="flex items-center gap-6 mt-1 pb-2 border-b border-slate-50">
                {ranking?.score != null && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-tight">Total Score</span>
                        <span className="text-sm font-bold text-[#475367]">{ranking.score.toLocaleString()}%</span>
                    </div>
                )}
                {ranking?.percentile != null && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-tight">Percentile</span>
                        <span className="text-sm font-bold text-[#475367]">{ranking.percentile.toFixed(1)}TH</span>
                    </div>
                )}
            </div>
        )}

        {/* Status Banner */}
         <div
            className="p-4 rounded-xl border flex items-center gap-3 mt-2 transition-all duration-300"
            style={{ backgroundColor: status_meta.bg_color, borderColor: `${status_meta.color}20` }}
         >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: status_meta.color }}
          >
            {status_meta.icon === 'check' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            ) : status_meta.icon === 'clock' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : status_meta.icon === 'alert' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ) : status_meta.icon === 'info' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: status_meta.color }}>
                {status_meta.status_label}
            </p>
            <p className="text-[11px] text-[#475367] leading-tight mt-0.5">
                {status_meta.status_subtext}
            </p>
          </div>
        </div>
      </div>

      {/* Scoreboards / Footer Link */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
        {context.scoreboards && context.scoreboards.length > 0 ? (
          <>
            <span className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-wider mb-1">Available Scoreboards</span>
            <div className="flex flex-col gap-2">
              {context.scoreboards.map((board, idx) => {
                const boardHref = board.type === 'leaderboard'
                  ? "/exam-portal/leaderboard"
                  : `/exam-portal/rankings/${board.exam_id}`;

                return (
                  <Link
                    key={idx}
                    href={boardHref}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      board.is_current
                        ? 'bg-[#3E4095]/5 border-[#3E4095]/10 text-[#3E4095]'
                        : 'bg-slate-50 border-slate-100 text-[#475367] hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{board.label}</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-tight">{board.stage}</span>
                    </div>
                    <GotoIcon />
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          isLinkEnabled ? (
            isLeague && onViewLeaderboard ? (
              <button
                onClick={onViewLeaderboard}
                className="text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all w-full text-left"
              >
                <span>Leaderboard</span>
                <GotoIcon />
              </button>
            ) : (
              <Link
                href={ranking?.exam_id ? `/exam-portal/rankings/${ranking.exam_id}` : "/exam-portal/leaderboard"}
                className="text-sm font-bold text-[#3E4095] hover:opacity-80 flex items-center justify-between transition-all"
              >
                <span>{(isScreening || isFinal) ? 'View Ranking Table' : 'View Leaderboard'}</span>
                <GotoIcon />
              </Link>
            )
          ) : (
            <div className="text-sm font-bold text-slate-300 flex items-center justify-between cursor-not-allowed grayscale">
              <span>{(isScreening || isFinal) ? 'Ranking' : 'Leaderboard'}</span>
              <GotoIcon />
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Performance;
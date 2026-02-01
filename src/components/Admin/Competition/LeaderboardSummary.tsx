import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import Image from "next/image"
import RankMedal from './RankMedal';

export interface LeaderboardEntry {
  candidate: string;
  candidate_name: string;
  school_name: string;
  total_score: string;
  overall_rank: number;
  rank_change: number;
  profile_picture?: string | null;
}

interface LeaderboardSummaryProps {
  entries: LeaderboardEntry[];
  onViewFull?: () => void;
  onViewCandidate?: (id: string) => void;
}

const RankChangeIndicator = ({ change }: { change: number }) => {
  if (change === 0) return <span className="text-[10px] text-gray-400 font-medium">-</span>;
  if (change > 0) return <span className="text-[10px] text-green-600 font-bold flex items-center">▲ {change}</span>;
  return <span className="text-[10px] text-red-600 font-bold flex items-center">▼ {Math.abs(change)}</span>;
}

const LeaderboardSummary: React.FC<LeaderboardSummaryProps> = ({ entries, onViewFull, onViewCandidate }) => {
  return (
    <ResponsiveContainer className="flex flex-col gap-4 font-sans">
      <div className="flex justify-between items-center mb-1 font-sans">
        <div>
          <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest mb-1">League Leaderboard</h2>
          <p className="text-[9px] text-[#667185]">Based on published standings only</p>
        </div>
        {onViewFull && entries.length > 0 && (
          <button 
            onClick={onViewFull}
            className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-[#344054] bg-white border border-[#D0D5DD] rounded-full hover:bg-[#3E4095] hover:text-[#FFFFFF] transition-all"
          >
            View Full
          </button>
        )}
      </div>

      <div className="bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-[#101828] uppercase tracking-wider mb-4">Top Performers</h3>
        
        {entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <button 
                key={entry.candidate} 
                onClick={() => onViewCandidate?.(entry.candidate)}
                className={`flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E4E7EC] text-left transition-all duration-300 relative overflow-hidden ${onViewCandidate ? 'hover:border-[#3E4095]/40 hover:shadow-sm group' : 'cursor-default'}`}
              >
                <div className="relative shrink-0">
                  {entry.profile_picture ? (
                    <Image 
                      src={entry.profile_picture} 
                      alt={entry.candidate_name}
                      width={40}
                      height={40}
                      className={`w-10 h-10 rounded-full object-cover border-2 border-[#F2F4F7] transition-colors ${onViewCandidate ? 'group-hover:border-[#3E4095]/20' : ''}`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#667185] text-xs font-bold border border-[#E4E7EC]">
                      {entry.candidate_name.charAt(0)}
                    </div>
                  )}
                  
                  <RankMedal 
                    rank={entry.overall_rank} 
                    className={`absolute -bottom-2 -right-2 drop-shadow-md transition-transform ${onViewCandidate ? 'group-hover:scale-110' : ''}`} 
                  />
                </div>

                <div className="flex flex-1 justify-between items-center min-w-0 ml-1">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#101828] truncate">
                      {entry.candidate_name}
                    </span>
                    <span className="text-[8px] text-[#667185] font-semibold uppercase tracking-wider truncate">
                      {entry.school_name}
                    </span>
                  </div>

                  <div className="flex flex-col items-end pl-2">
                    <span className="text-xs font-black text-[#3E4095] bg-white border border-[#3E4095]/60  px-1 py-0.5 rounded-md">
                      {entry.total_score}
                    </span>
                    <div className="mt-0.5">
                      <RankChangeIndicator change={entry.rank_change} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-white rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 italic">No rankings available yet.</p>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default LeaderboardSummary;
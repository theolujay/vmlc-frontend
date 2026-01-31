import React from 'react';
import { ViewLeaderBoardIcon } from '../AdminIcons';
import { CandidateType } from '@/types/LeaderBoardType'; // Assuming alias usage or relative path

interface LeaderboardSummaryProps {
  topCandidates: CandidateType[];
  onViewFull: () => void;
}

const LeaderboardSummary: React.FC<LeaderboardSummaryProps> = ({ topCandidates, onViewFull }) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white border border-[#E4E7EC] rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold text-[#475367] uppercase tracking-widest mb-1">League Leaderboard</h2>
          <p className="text-xs text-[#667185]">Based on published rounds only</p>
        </div>
        <button 
          onClick={onViewFull}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3E4095] bg-[#EBEBF5] rounded hover:bg-[#D9D9E3] transition-colors"
        >
          <ViewLeaderBoardIcon className="w-4 h-4" />
          View Full Board
        </button>
      </div>

      <div className="bg-[#F9FAFB] border border-[#F2F4F7] rounded-lg p-4">
        <h3 className="text-xs font-semibold text-[#101828] mb-3">Top 3 Candidates:</h3>
        
        {topCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((c) => (
              <div key={c.candidate.id} className="flex items-center gap-3 bg-white p-3 rounded border border-[#E4E7EC]">
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                  ${c.rank === 1 ? 'bg-[#FDB022]' : c.rank === 2 ? 'bg-[#98A2B3]' : 'bg-[#B54708]'} 
                  // Fallback colors for gold/silver/bronze roughly
                `}>
                  {c.rank}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-[#101828] truncate">{c.candidate.full_name}</span>
                  <span className="text-xs font-bold text-[#3E4095]">{c.score.toFixed(1)} pts</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No rankings available yet.</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardSummary;

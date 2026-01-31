import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { CandidateType } from '@/types/LeaderBoardType';
import Image from "next/image"

interface LeaderboardSummaryProps {
  topCandidates: CandidateType[];
  onViewFull: () => void;
}

const RankMedal: React.FC<{ rank: number; className?: string }> = ({ rank, className }) => {
  const gradientId = `medal-gradient-${rank}`;
  
  // Define colors for Gold, Silver, Bronze
  const colors = rank === 1 
    ? { start: "#FFD700", mid: "#FDB931", end: "#B8860B" } // Gold
    : rank === 2 
    ? { start: "#F2F4F7", mid: "#98A2B3", end: "#475367" } // Silver
    : { start: "#F97316", mid: "#B54708", end: "#7A2706" }; // Bronze

  return (
    <svg 
      width="" 
      height="20" 
      viewBox="0 0 15 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="50%" stopColor={colors.mid} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>
      {/* Medal Ribbon/Body Path from CandidatePerformanceIcon */}
      <path 
        d="M4.05722 12.8836L3.33333 18.3337L7.157 16.0395C7.28171 15.9646 7.34406 15.9272 7.41063 15.9126C7.46951 15.8997 7.53049 15.8997 7.58937 15.9126C7.65593 15.9272 7.71829 15.9646 7.843 16.0395L11.6667 18.3337L10.9433 12.8812M11.1882 3.54106C11.3169 3.85232 11.564 4.09974 11.875 4.22891L12.9658 4.68073C13.2771 4.80967 13.5244 5.05699 13.6533 5.36828C13.7822 5.67957 13.7822 6.02933 13.6533 6.34062L13.2018 7.43062C13.0728 7.74205 13.0726 8.09216 13.2022 8.40344L13.6529 9.49312C13.7168 9.64729 13.7498 9.81256 13.7498 9.97946C13.7498 10.1464 13.7169 10.3116 13.6531 10.4658C13.5892 10.62 13.4956 10.7601 13.3775 10.8781C13.2595 10.9961 13.1194 11.0897 12.9652 11.1535L11.8752 11.605C11.564 11.7337 11.3166 11.9808 11.1874 12.2919L10.7356 13.3826C10.6067 13.6939 10.3593 13.9412 10.0481 14.0702C9.73679 14.1991 9.38704 14.1991 9.07576 14.0702L7.9858 13.6187C7.67451 13.4901 7.32489 13.4903 7.0138 13.6194L5.92306 14.0706C5.61195 14.1992 5.26251 14.1991 4.95148 14.0703C4.64045 13.9415 4.39328 13.6944 4.26426 13.3835L3.81232 12.2924C3.68363 11.9811 3.43659 11.7337 3.12553 11.6045L2.03479 11.1527C1.72365 11.0238 1.47641 10.7766 1.34743 10.4655C1.21844 10.1544 1.21827 9.80482 1.34694 9.49358L1.79841 8.40359C1.92703 8.09229 1.92677 7.74265 1.79768 7.43154L1.34686 6.33998C1.28294 6.1858 1.25003 6.02054 1.25 5.85364C1.24997 5.68673 1.28283 5.52146 1.3467 5.36726C1.41057 5.21306 1.5042 5.07296 1.62223 4.95496C1.74026 4.83696 1.88039 4.74338 2.0346 4.67956L3.12456 4.22807C3.43554 4.09947 3.6828 3.85274 3.81206 3.54203L4.26386 2.45125C4.3928 2.13996 4.64011 1.89264 4.95139 1.7637C5.26267 1.63476 5.61242 1.63476 5.9237 1.7637L7.01365 2.21519C7.32494 2.34381 7.67456 2.34355 7.98566 2.21446L9.07686 1.7644C9.38809 1.63553 9.73777 1.63556 10.049 1.76447C10.3602 1.89339 10.6075 2.14063 10.7364 2.45184L11.1884 3.54295L11.1882 3.54106Z" 
        stroke={`url(#${gradientId})`} 
        fill={`url(#${gradientId})`}
        fillOpacity="0.1"
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Rank Number */}
      <text 
        x="7.5" 
        y="9.5" 
        textAnchor="middle" 
        fill={`url(#${gradientId})`} 
        fontSize="7" 
        fontWeight="900" 
        className="font-sans"
      >
        {rank}
      </text>
    </svg>
  );
};

const LeaderboardSummary: React.FC<LeaderboardSummaryProps> = ({ topCandidates, onViewFull }) => {
  return (
    <ResponsiveContainer className="flex flex-col gap-4 font-sans">
      <div className="flex justify-between items-center mb-1 font-sans">
        <div>
          <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest mb-1">League Leaderboard</h2>
          <p className="text-[9px] text-[#667185]">Based on published standings only</p>
        </div>
        <button 
          onClick={onViewFull}
          className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-[#344054] bg-white border border-[#D0D5DD] rounded-full hover:bg-[#3E4095] hover:text-[#FFFFFF] transition-all"
        >
          View Full
        </button>
      </div>

      <div className="bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-[#101828] uppercase tracking-wider mb-4">Top Performers</h3>
        
        {topCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((c) => (
              <div 
                key={c.profile.id} 
                className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E4E7EC] transition-all duration-300 hover:border-[#3E4095] hover:shadow-sm group relative overflow-hidden"
              >
                {/* Profile Image & Medal Overlay */}
                <div className="relative shrink-0">
                  {c.profile.profile_picture ? (
                    <Image 
                      src={c.profile.profile_picture} 
                      alt={c.profile.full_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#F2F4F7] group-hover:border-[#3E4095]/20 transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#667185] text-xs font-bold border border-[#E4E7EC]">
                      {c.profile.full_name.charAt(0)}
                    </div>
                  )}
                  
                  {/* Enhanced Medal Icon Overlay */}
                  <RankMedal 
                    rank={c.rank} 
                    className="absolute -bottom-2 -right-2 drop-shadow-md group-hover:scale-110 transition-transform" 
                  />
                </div>

                {/* Content Wrapper */}
                <div className="flex flex-1 justify-between items-center min-w-0 ml-1">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-[#101828] truncate">
                      {c.profile.full_name}
                    </span>
                    <span className="text-[8px] text-[#667185] font-semibold uppercase tracking-wider truncate">
                      {c.profile.school_name}
                    </span>
                  </div>

                  <div className="shrink-0 pl-2">
                    <span className="text-xs font-black text-[#3E4095] bg-white border border-[#3E4095]/60 px-2 py-1 rounded-md">
                      {c.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
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

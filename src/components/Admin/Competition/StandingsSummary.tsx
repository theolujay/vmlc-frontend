import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import Image from "next/image"

// Define the type based on the Standings API response in COMPETITION.md
export interface StandingsEntry {
  candidate: string; // uuid
  candidate_name: string;
  candidate_email: string;
  school_name: string;
  exam_score: string; // "95.50"
  rank: number;
  percentile: number;
  profile_picture?: string | null; // Optional, assuming we might map this in if available
}

interface StandingsSummaryProps {
  examTitle: string;
  entries: StandingsEntry[];
  onViewFull: () => void;
}

const RankMedal: React.FC<{ rank: number; className?: string }> = ({ rank, className }) => {
  const gradientId = `standings-medal-gradient-${rank}`;
  
  // Slightly different tones for Standings to distinguish from League
  const colors = rank === 1 
    ? { start: "#FDE68A", mid: "#F59E0B", end: "#B45309" } // Amber/Gold
    : rank === 2 
    ? { start: "#F3F4F6", mid: "#9CA3AF", end: "#4B5563" } // Cool Gray
    : { start: "#FDBA74", mid: "#EA580C", end: "#9A3412" }; // Orange/Bronze

  return (
    <svg 
      width="14" 
      height="14" 
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
      <path 
        d="M4.05722 12.8836L3.33333 18.3337L7.157 16.0395C7.28171 15.9646 7.34406 15.9272 7.41063 15.9126C7.46951 15.8997 7.53049 15.8997 7.58937 15.9126C7.65593 15.9272 7.71829 15.9646 7.843 16.0395L11.6667 18.3337L10.9433 12.8812M11.1882 3.54106C11.3169 3.85232 11.564 4.09974 11.875 4.22891L12.9658 4.68073C13.2771 4.80967 13.5244 5.05699 13.6533 5.36828C13.7822 5.67957 13.7822 6.02933 13.6533 6.34062L13.2018 7.43062C13.0728 7.74205 13.0726 8.09216 13.2022 8.40344L13.6529 9.49312C13.7168 9.64729 13.7498 9.81256 13.7498 9.97946C13.7498 10.1464 13.7169 10.3116 13.6531 10.4658C13.5892 10.62 13.4956 10.7601 13.3775 10.8781C13.2595 10.9961 13.1194 11.0897 12.9652 11.1535L11.8752 11.605C11.564 11.7337 11.3166 11.9808 11.1874 12.2919L10.7356 13.3826C10.6067 13.6939 10.3593 13.9412 10.0481 14.0702C9.73679 14.1991 9.38704 14.1991 9.07576 14.0702L7.9858 13.6187C7.67451 13.4901 7.32489 13.4903 7.0138 13.6194L5.92306 14.0706C5.61195 14.1992 5.26251 14.1991 4.95148 14.0703C4.64045 13.9415 4.39328 13.6944 4.26426 13.3835L3.81232 12.2924C3.68363 11.9811 3.43659 11.7337 3.12553 11.6045L2.03479 11.1527C1.72365 11.0238 1.47641 10.7766 1.34743 10.4655C1.21844 10.1544 1.21827 9.80482 1.34694 9.49358L1.79841 8.40359C1.92703 8.09229 1.92677 7.74265 1.79768 7.43154L1.34686 6.33998C1.28294 6.1858 1.25003 6.02054 1.25 5.85364C1.24997 5.68673 1.28283 5.52146 1.3467 5.36726C1.41057 5.21306 1.5042 5.07296 1.62223 4.95496C1.74026 4.83696 1.88039 4.74338 2.0346 4.67956L3.12456 4.22807C3.43554 4.09947 3.6828 3.85274 3.81206 3.54203L4.26386 2.45125C4.3928 2.13996 4.64011 1.89264 4.95139 1.7637C5.26267 1.63476 5.61242 1.63476 5.9237 1.7637L7.01365 2.21519C7.32494 2.34381 7.67456 2.34355 7.98566 2.21446L9.07686 1.7644C9.38809 1.63553 9.73777 1.63556 10.049 1.76447C10.3602 1.89339 10.6075 2.14063 10.7364 2.45184L11.1884 3.54295L11.1882 3.54106Z" 
        stroke={`url(#${gradientId})`} 
        fill={`url(#${gradientId})`}
        fillOpacity="0.1"
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <text 
        x="7.5" 
        y="8.5" 
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

const StandingsSummary: React.FC<StandingsSummaryProps> = ({ examTitle, entries }) => {
  return (
    <ResponsiveContainer className="flex flex-col gap-4 font-sans">
      <div className="flex justify-between items-center mb-1 font-sans">
        <div>
          <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest mb-1">Standings: {examTitle}</h2>
          <p className="text-[9px] text-[#667185]">Latest published</p>
        </div>
      </div>

      <div className="bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-[#101828] uppercase tracking-wider mb-4">Top Results</h3>
        
        {entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <div 
                key={entry.candidate} 
                className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E4E7EC] transition-all duration-300 hover:border-cyan-600/40 hover:shadow-sm group relative overflow-hidden"
              >
                {/* Profile Image & Medal Overlay */}
                <div className="relative shrink-0">
                  {entry.profile_picture ? (
                    <Image 
                      src={entry.profile_picture} 
                      alt={entry.candidate_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#F2F4F7] group-hover:border-cyan-600/40 transition-colors"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#667185] text-xs font-bold border border-[#E4E7EC]">
                      {entry.candidate_name.charAt(0)}
                    </div>
                  )}
                  
                  <RankMedal 
                    rank={entry.rank} 
                    className="absolute -bottom-2 -right-2 drop-shadow-md group-hover:scale-110 transition-transform" 
                  />
                </div>

                {/* Content Wrapper */}
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
                    <span className="text-xs font-black text-cyan-600 bg-white border border-cyan-600/60 px-1 py-0.5 rounded-md">
                      {entry.exam_score}
                    </span>
                    <span className="text-[8px] font-medium text-[#667185] mt-0.5">
                      Top {100 - entry.percentile}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center bg-white rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 italic">No standings available.</p>
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default StandingsSummary;

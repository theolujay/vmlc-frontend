import React, { useState } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';
import useGetLeagueLeaderboard from '@/hooks/useGetLeagueLeaderboard';
import { LeagueLeaderboardEntry, LeagueLeaderboardResponse } from '@/types/LeaderBoardType';

const RankChangeIndicator = ({ change }: { change: number }) => {
  if (change === 0) return <span className="text-gray-400 font-medium">-</span>;
  if (change > 0) return <span className="text-green-600 font-bold text-xs">▲ {change}</span>;
  return <span className="text-red-600 font-bold text-xs">▼ {Math.abs(change)}</span>;
}

interface FullLeagueLeaderboardProps {
  onBack: () => void;
  onViewDetails?: (candidateId: string) => void;
}

const FullLeagueLeaderboard: React.FC<FullLeagueLeaderboardProps> = ({ onBack, onViewDetails }) => {
  const [searchTerm, setSearchInput] = useState('');
  const { data, isLoading, error, refetch } = useGetLeagueLeaderboard();

  const leaderboardData = (data as unknown as LeagueLeaderboardResponse)?.entries || [];

  const filteredData = leaderboardData.filter(item => 
    item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
        <p className="mt-4 text-sm text-[#667185] font-medium animate-pulse">Loading Leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
           <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-[#101828]">Failed to load leaderboard</h2>
        <p className="text-sm text-[#667185] mt-1 max-w-xs mx-auto">There was an error retrieving the ranking data. Please try again.</p>
        <button 
          onClick={() => refetch()}
          className="mt-6 px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold text-sm hover:bg-[#2d2f6e] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="rotate-180"><AngleIcon width={8} height={14} /></div>
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#101828]">League Leaderboard</h1>
          <p className="text-xs text-[#667185]">Cumulative scores across all published rounds</p>
        </div>
      </div>

      <ResponsiveContainer className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 p-1">
          <input
            value={searchTerm}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search candidate or school..."
            className="border h-10 px-3 py-1 rounded-md border-[#E4E7EC] outline-none w-full sm:w-80 text-sm focus:border-[#3E4095] transition-colors"
          />
          <div className="flex gap-2">
             <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <SortIcon className="w-4 h-4" />
                <span className="text-[#344054] text-sm font-medium">Sort</span>
             </button>
             <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                <FilterIcon className="w-4 h-4" />
                <span className="text-[#344054] text-sm font-medium">Filter</span>
             </button>
          </div>
        </div>

        <CustomTable<LeagueLeaderboardEntry>
          data={filteredData}
          minWidth="900px"
          emptyLabel="Leaderboard Empty"
          emptyDesc="No rankings have been generated for this stage yet."
          columns={[
            {
              key: 'overall_rank',
              header: 'Rank',
              render: (val) => (
                <div className="flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-500"># {val}</span>
                </div>
              ),
              align: 'center'
            },
            {
              key: 'rank_change',
              header: 'Trend',
              render: (val) => <RankChangeIndicator change={val} />,
              align: 'center'
            },
            {
              key: 'candidate_name',
              header: 'Candidate',
              render: (_, row) => (
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#667185] text-xs font-bold border border-[#E4E7EC] overflow-hidden relative">
                        {row.profile_picture ? (
                          <Image src={row.profile_picture} alt="" fill className="object-cover" />
                        ) : row.candidate_name.charAt(0)}
                    </div>
                    {row.overall_rank <= 3 && (
                      <RankMedal rank={row.overall_rank} className="absolute -bottom-1 -right-1 drop-shadow-md" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#101828] text-sm">{row.candidate_name}</span>
                    <span className="text-[10px] text-[#667185]">{row.candidate_email}</span>
                  </div>
                </div>
              )
            },
            {
              key: 'school_name',
              header: 'School',
              render: (val) => <span className="text-sm text-[#475467] font-medium">{val}</span>
            },
            {
              key: 'total_score',
              header: 'Cumulative Score',
              render: (val) => (
                <span className="text-xs font-black text-[#3E4095] bg-white px-2 py-1 rounded-full border border-[#3E4095]/50">
                  {val}
                </span>
              ),
              align: 'right'
            },
            {
              key: 'action',
              header: 'Action',
              render: (_, row) => (
                <button 
                  onClick={() => onViewDetails?.(row.candidate)}
                  className="text-[#3E4095] font-bold hover:bg-[#3E4095] hover:text-white text-xs bg-[#F9F9FB] px-3 py-1.5 rounded-full border border-[#E4E7EC] transition-colors"
                >
                  View Details
                </button>
              ),
              align: 'right'
            }
          ]}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default FullLeagueLeaderboard;

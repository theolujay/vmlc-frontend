import React, { useState } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';

export interface LeagueLeaderboardEntry {
  candidate: string;
  candidate_name: string;
  school_name: string;
  candidate_state: string;
  candidate_email: string;
  total_score: string;
  overall_rank: number;
  rank_change: number;
  profile_picture?: string | null;
}

// Extended Mock Data
const MOCK_LEAGUE_DATA: LeagueLeaderboardEntry[] = [
  { overall_rank: 1, total_score: "372.50", rank_change: 0, candidate: 'c1', candidate_name: 'Candidate A', candidate_email: 'a@example.com', school_name: 'St. Peters College', candidate_state: 'Lagos' },
  { overall_rank: 2, total_score: "369.00", rank_change: 2, candidate: 'c2', candidate_name: 'Candidate B', candidate_email: 'b@example.com', school_name: 'Victory Academy', candidate_state: 'Abuja' },
  { overall_rank: 3, total_score: "365.00", rank_change: -1, candidate: 'c3', candidate_name: 'Candidate C', candidate_email: 'c@example.com', school_name: 'Greenwood High', candidate_state: 'Oyo' },
  { overall_rank: 4, total_score: "360.50", rank_change: 0, candidate: 'c4', candidate_name: 'Candidate D', candidate_email: 'd@example.com', school_name: 'Blue Valley School', candidate_state: 'Rivers' },
  { overall_rank: 5, total_score: "358.00", rank_change: 1, candidate: 'c5', candidate_name: 'Candidate E', candidate_email: 'e@example.com', school_name: 'St. Peters College', candidate_state: 'Lagos' },
  { overall_rank: 6, total_score: "355.00", rank_change: -2, candidate: 'c6', candidate_name: 'Candidate F', candidate_email: 'f@example.com', school_name: 'Victory Academy', candidate_state: 'Abuja' },
  { overall_rank: 7, total_score: "350.00", rank_change: 0, candidate: 'c7', candidate_name: 'Candidate G', candidate_email: 'g@example.com', school_name: 'Sunrise High', candidate_state: 'Kano' },
];

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

  const filteredData = MOCK_LEAGUE_DATA.filter(item => 
    item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            className="border h-10 px-3 py-1 rounded-md border-[#E4E7EC] outline-none w-full sm:w-80 text-sm"
          />
          <div className="flex gap-2">
             <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer bg-white">
                <SortIcon />
                <span className="text-[#344054] text-sm">Sort</span>
             </button>
             <button className="inline-flex items-center justify-center gap-2 border h-10 rounded-md px-3 py-1 border-[#E4E7EC] cursor-pointer bg-white">
                <FilterIcon />
                <span className="text-[#344054] text-sm">Filter</span>
             </button>
          </div>
        </div>

        <CustomTable<LeagueLeaderboardEntry>
          data={filteredData}
          minWidth="900px"
          columns={[
            {
              key: 'overall_rank',
              header: 'Rank',
              render: (val) => (
                <div className="flex items-center justify-center">
                   <span className="text-sm font-bold text-gray-400"># {val}</span>
                </div>
              ),
              align: 'center'
            },
            {
              key: 'candidate_name',
              header: 'Candidate',
              render: (_, row) => (
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#667185] text-xs font-bold border border-[#E4E7EC] overflow-hidden relative">
                      {row.profile_picture ? (
                        <Image src={row.profile_picture} alt="" fill className="object-cover" />
                      ) : row.candidate_name.charAt(0)}
                    </div>
                    {row.overall_rank <= 3 && (
                      <RankMedal rank={row.overall_rank} className="absolute -bottom-1 -right-1 drop-shadow-sm w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#101828] text-sm">{row.candidate_name}</span>
                    {/* <span className="text-[10px] text-[#667185]">{row.candidate_email}</span> */}
                  </div>
                </div>
              ),
              align: 'left'
            },
            {
              key: 'school_name',
              header: 'School',
              render: (val, row) => (
                <div className="flex flex-col">
                  <span className="text-sm text-[#475467] font-medium">{val}</span>
                  <span className="text-[10px] text-[#667185]">{row.candidate_state}</span>
                </div>
              ),
              align: 'left'
            },
            {
              key: 'rank_change',
              header: 'Trend',
              render: (val) => <RankChangeIndicator change={val} />,
              align: 'center'
            },
            {
              key: 'total_score',
              header: 'Cumulative',
              render: (val) => (
                <span className="text-xs font-black text-[#3E4095] bg-white px-2 py-1 rounded-full border border-[#3E4095]/50">
                  {val}
                </span>
              ),
              align: 'center'
            },
            {
              key: 'action',
              header: 'Action',
              render: (_, row) => (
                <button 
                  onClick={() => onViewDetails?.(row.candidate)}
                  className="text-[#3E4095] font-bold hover:bg-[#3E4095] hover:text-white text-xs bg-[#F9F9FB] px-3 py-1.5 rounded-full border border-[#E4E7EC]"
                >
                  View Details
                </button>
              ),
              align: 'center'
            }
          ]}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default FullLeagueLeaderboard;
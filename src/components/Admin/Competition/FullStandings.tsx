import React, { useState } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';

export interface StandingsEntry {
  candidate: string;
  candidate_name: string;
  candidate_email: string;
  school_name: string;
  candidate_state: string;
  exam_score: string;
  rank: number;
  percentile: number;
  profile_picture?: string | null;
}

const MOCK_STANDINGS_DATA: StandingsEntry[] = [
  { rank: 1, exam_score: "95.50", percentile: 99.9, candidate: 's1', candidate_name: 'John Doe', candidate_email: 'john@example.com', school_name: 'St. Peters College', candidate_state: 'Lagos' },
  { rank: 2, exam_score: "92.00", percentile: 98.5, candidate: 's2', candidate_name: 'Jane Smith', candidate_email: 'jane@example.com', school_name: 'Victory Academy', candidate_state: 'Abuja' },
  { rank: 3, exam_score: "89.50", percentile: 97.2, candidate: 's3', candidate_name: 'Alice Brown', candidate_email: 'alice@example.com', school_name: 'Greenwood High', candidate_state: 'Oyo' },
  { rank: 4, exam_score: "88.00", percentile: 96.0, candidate: 's4', candidate_name: 'Bob White', candidate_email: 'bob@example.com', school_name: 'Blue Valley School', candidate_state: 'Rivers' },
  { rank: 5, exam_score: "85.00", percentile: 94.5, candidate: 's5', candidate_name: 'Charlie Green', candidate_email: 'charlie@example.com', school_name: 'St. Peters College', candidate_state: 'Lagos' },
];

interface FullStandingsProps {
  onBack: () => void;
  examTitle?: string;
  onViewDetails?: (candidateId: string) => void;
}

const FullStandings: React.FC<FullStandingsProps> = ({ onBack, examTitle = "Latest Exam", onViewDetails }) => {
  const [searchTerm, setSearchInput] = useState('');

  const filteredData = MOCK_STANDINGS_DATA.filter(item => 
    item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full font-sans animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
        >
          <div className="rotate-180"><AngleIcon width={8} height={14} /></div>
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-sans font-bold text-[#101828]">Standings {examTitle}</h1>
          <p className="text-xs text-[#667185]">Detailed results for this round</p>
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

        <CustomTable<StandingsEntry>
          data={filteredData}
          minWidth="900px"
          columns={[
            {
              key: 'rank',
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
                    {row.rank <= 3 && (
                      <RankMedal rank={row.rank} variant="standings" className="absolute -bottom-1 -right-1 drop-shadow-sm w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#101828] text-sm">{row.candidate_name}</span>
                    {/* <span className="text-[10px] text-[#667185]">{row.candidate_email}</span> */}
                  </div>
                </div>
              )
            },
            {
              key: 'school_name',
              header: 'School',
              render: (val, row) => (
                <div className="flex flex-col">
                  <span className="text-sm text-[#475467] font-medium">{val}</span>
                  <span className="text-[10px] text-[#667185]">{row.candidate_state}</span>
                </div>
              )
            },
            {
              key: 'percentile',
              header: 'Percentile',
              render: (val) => <span className="text-xs text-gray-500">{val}%</span>,
              align: 'right'
            },
            {
              key: 'exam_score',
              header: 'Score',
              render: (val) => (
                <span className="text-xs font-black text-cyan-600 bg-white px-3 py-1 rounded-full border border-cyan-600/40">
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
                  className="text-cyan-600 font-bold hover:bg-cyan-600 hover:text-white text-xs bg-white px-3 py-1.5 rounded-full border border-cyan-600/40"
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

export default FullStandings;
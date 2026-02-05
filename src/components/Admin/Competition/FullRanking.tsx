/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';
import useGetRanking from '@/hooks/useGetRanking';
import { RankingEntry, RankingResponse } from '@/types/LeaderBoardType';

interface FullRankingProps {
  onBack: () => void;
  examId: string;
  examTitle: string;
  onViewDetails?: (candidateId: string) => void;
  isPublicView?: boolean;
}

const FullRanking: React.FC<FullRankingProps> = ({ onBack, examId, examTitle, onViewDetails, isPublicView = false }) => {
  const [searchTerm, setSearchInput] = useState('');
  const { data, isLoading, error, refetch } = useGetRanking(examId);

  const rankingData = (data as unknown as RankingResponse)?.entries || [];
  const responseData = data as unknown as RankingResponse;
  
  const displayTitle = examTitle || (responseData ? `${responseData.stage_display} ${responseData.round ? `- Round ${responseData.round}` : ''}` : 'Ranking');

  const filteredData = rankingData.filter(item => 
    item.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.school_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        <p className="mt-4 text-sm text-[#667185] font-medium animate-pulse">Loading Ranking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
           <span className="text-red-500 text-2xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-[#101828]">Failed to load ranking</h2>
        <p className="text-sm text-[#667185] mt-1 max-w-xs mx-auto">There was an error retrieving the result data for this exam. Please try again.</p>
        <button 
          onClick={() => refetch()}
          className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-full font-bold text-sm hover:bg-cyan-700 transition-colors"
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
          <h1 className="text-xl font-bold text-[#101828]">Ranking: {displayTitle}</h1>
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
            className="border h-10 px-3 py-1 rounded-md border-[#E4E7EC] outline-none w-full sm:w-80 text-sm focus:border-cyan-600 transition-colors"
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

        <CustomTable<RankingEntry>
          data={filteredData}
          minWidth="900px"
          emptyLabel="Results Empty"
          emptyDesc="No ranking data has been processed for this exam yet."
          columns={[
            {
              key: 'rank',
              header: 'Rank',
              render: (val) => (
                <div className="flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-500"># {val}</span>
                </div>
              ),
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
                    <RankMedal rank={row.rank} className="absolute -bottom-1 -right-1 drop-shadow-md" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#101828] text-sm">{row.candidate_name}</span>
                    {!isPublicView && <span className="text-[10px] text-[#667185]">{row.candidate_email}</span>}
                  </div>
                </div>
              ),
              align: 'left'
            },
            {
              key: 'school_name',
              header: 'School',
              render: (val) => <span className="text-sm text-[#475467] font-medium">{val}</span>
            },
            // {
            //   key: 'percentile',
            //   header: 'Percentile',
            //   render: (val) => <span className="text-xs text-gray-500">{val}%</span>,
            //   align: 'right'
            // },
            {
              key: 'exam_score',
              header: 'Score',
              render: (val) => (
                <span className="text-xs font-black text-cyan-600 bg-white px-3 py-1 rounded-full border border-cyan-600/40">
                  {val}
                </span>
              ),
              align: 'center'
            },
            ...(onViewDetails && !isPublicView ? [{
              key: 'action',
              header: 'Action',
              render: (_: any, row: RankingEntry) => (
                <button 
                  onClick={() => onViewDetails?.(row.candidate)}
                  className="text-cyan-600 font-bold hover:bg-cyan-600 hover:text-white text-xs bg-white px-3 py-1.5 rounded-full border border-cyan-600/40 transition-colors"
                >
                  View Details
                </button>
              ),
              align: 'center' as const
            }] : [])
          ]}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default FullRanking;
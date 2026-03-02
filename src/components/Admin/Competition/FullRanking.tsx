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
    (item.candidate_info?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.candidate_info?.school_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={onBack}
          className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
        >
          <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform"><AngleIcon width={8} height={14} /></div>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#3E4095] rounded-full"></div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">Ranking: {displayTitle}</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed results for this round</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col w-full font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="flex md:flex-row md:items-center justify-between px-8 gap-4 mb-2">
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
            <input
              value={searchTerm}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search candidate or school..."
              className="bg-gray-50/50 border border-gray-100 h-11 pl-11 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-semibold w-full md:w-80 shadow-inner"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                <SortIcon className="w-4 h-4" />
                <span>Sort</span>
             </button>
             <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                <FilterIcon className="w-4 h-4" />
                <span>Filter</span>
             </button>
          </div>
        </div>

        <CustomTable<RankingEntry>
          data={filteredData}
          getRowId={(row) => row.candidate}
          minWidth="900px"
          emptyLabel="Results Empty"
          emptyDesc="No ranking data has been processed for this exam yet."
          columns={[
            {
              key: 'sn',
              header: 'S/N',
              render: (_, __, index) => (
                <div className="flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                </div>
              ),
              align: 'center'
            },
            {
              key: 'rank',
              header: 'Rank',
              render: (val) => (
                <div className="flex items-center justify-center">
                  <span className="text-sm font-black text-[#3E4095] bg-blue-50/50 px-3 py-1 rounded-lg border border-blue-100/50"># {val}</span>
                </div>
              ),
              align: 'center'
            },
            {
              key: 'candidate_info',
              header: 'Candidate',
              render: (val: any, row) => (
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3E4095] flex items-center justify-center text-xs font-black border border-blue-100/50 overflow-hidden relative">
                        {row.profile_picture ? (
                          <Image src={row.profile_picture} alt="" fill className="object-cover" />
                        ) : val?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <RankMedal rank={row.rank} className="absolute -bottom-1 -right-1 drop-shadow-md" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-800 text-sm">{val?.full_name}</span>
                    {!isPublicView && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{val?.email}</span>}
                  </div>
                </div>
              ),
              align: 'left'
            },
            {
              key: 'candidate_info',
              header: 'School',
              render: (val: any) => (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700 font-bold">{val?.school_name}</span>
                  {!isPublicView && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{val?.school_type}</span>}
                </div>
              )
            },
            ...(isPublicView ? [
              {
                key: 'candidate_info',
                header: 'Class',
                render: (val: any) => <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">{val?.current_class}</span>,
                align: 'center' as const
              },
              {
                key: 'candidate_info',
                header: 'State',
                render: (val: any) => <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{val?.state}</span>,
                align: 'center' as const
              }
            ] : []),
            {
              key: 'exam_score',
              header: 'Score (%)',
              render: (val) => {
                const isAbsent = typeof val === 'string' && val.toLowerCase() === 'absent';
                return (
                  <div className="flex justify-center">
                    <span className={`text-[11px] font-black px-2 py-1.5 rounded-full border uppercase transition-all ${
                      isAbsent
                        ? "text-gray-400 bg-gray-50 border-gray-200 tracking-tight"
                        : "text-[#3E4095] bg-[#FFFFFF] border-[#3E4095]/40 shadow-sm shadow-emerald-500/5 tracking-widest"
                    }`}>
                      {isAbsent ? "ABSENT" : val}
                    </span>
                  </div>
                );
              },
              align: 'center'
            },
            ...(onViewDetails && !isPublicView ? [{
              key: 'details',
              header: 'Details',
              render: (_: any, row: RankingEntry) => (
                <div className="flex justify-center">
                  <button
                    onClick={() => onViewDetails?.(row.candidate)}
                    className="bg-[#3E4095] text-white font-black px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#2d2f6e] transition-all shadow-md shadow-[#3E4095]/10 active:scale-95"
                  >
                    View
                  </button>
                </div>
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
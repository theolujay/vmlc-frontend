/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';
import useGetRanking from '@/hooks/useGetRanking';
import { RankingEntry } from '@/types/ScoreboardType';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Spinner from "@/components/ui/spinner/spinner";
import clsx from 'clsx';
import { formatDateTime } from '@/utils/formatFileSize';
import { formatTime } from '@/utils/formatTime';

interface FullRankingProps {
  onBack: () => void;
  examId: string;
  examTitle: string;
  onViewDetails?: (candidateId: string) => void;
  isPublicView?: boolean;
  containerClassName?: string;
}

type SortKey = 'rank' | 'name' | 'school' | 'class' | 'state' | 'score' | 'percentile' | 'time_used' | 'violation_score';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface FilterState {
  state: string;
  schoolType: string;
  currentClass: string;
}

const FullRanking: React.FC<FullRankingProps> = ({ onBack, examId, examTitle, onViewDetails, isPublicView = false, containerClassName }) => {
  const [searchTerm, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rank', direction: 'asc' });
  const [filterState, setFilterState] = useState<FilterState>({
    state: 'All States',
    schoolType: 'All Types',
    currentClass: 'All Classes',
  });

  const { data, isLoading, error, refetch } = useGetRanking(examId);

  const rankingData = useMemo(() => data?.entries || [], [data]);
  const responseData = data;

  const displayTitle = examTitle || (responseData ? `${responseData.stage_display} ${responseData.round ? `- Round ${responseData.round}` : ''}` : 'Ranking');

  const filterOptions = useMemo(() => {
    const states = new Set<string>();
    const types = new Set<string>();
    const classes = new Set<string>();

    rankingData.forEach(item => {
      if (item.candidate_info?.state) states.add(item.candidate_info.state);
      if (item.candidate_info?.school_type) types.add(item.candidate_info.school_type);
      if (item.candidate_info?.current_class) classes.add(item.candidate_info.current_class);
    });

    return {
      states: ['All States', ...Array.from(states).sort()],
      schoolTypes: ['All Types', ...Array.from(types).sort()],
      currentClasses: ['All Classes', ...Array.from(classes).sort()]
    };
  }, [rankingData]);

  const processedData = useMemo(() => {
    const result = [...rankingData].filter(item => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        (item.candidate_info?.full_name?.toLowerCase() || '').includes(searchStr) ||
        (item.candidate_info?.school_name?.toLowerCase() || '').includes(searchStr) ||
        (item.candidate_info?.email?.toLowerCase() || '').includes(searchStr);

      const matchesState = filterState.state === 'All States' || item.candidate_info?.state === filterState.state;
      const matchesSchoolType = filterState.schoolType === 'All Types' || item.candidate_info?.school_type === filterState.schoolType;
      const matchesClass = filterState.currentClass === 'All Classes' || item.candidate_info?.current_class === filterState.currentClass;

      return matchesSearch && matchesState && matchesSchoolType && matchesClass;
    });

    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortConfig.key) {
        case 'rank':
          valA = a.rank;
          valB = b.rank;
          break;
        case 'score':
          valA = typeof a.exam_score === 'string' ? -1 : a.exam_score;
          valB = typeof b.exam_score === 'string' ? -1 : b.exam_score;
          break;
        case 'percentile':
          valA = a.percentile || 0;
          valB = b.percentile || 0;
          break;
        case 'name':
          valA = a.candidate_info?.full_name?.toLowerCase() || '';
          valB = b.candidate_info?.full_name?.toLowerCase() || '';
          break;
        case 'school':
          valA = a.candidate_info?.school_name?.toLowerCase() || '';
          valB = b.candidate_info?.school_name?.toLowerCase() || '';
          break;
        case 'class':
          valA = a.candidate_info?.current_class?.toLowerCase() || '';
          valB = b.candidate_info?.current_class?.toLowerCase() || '';
          break;
        case 'state':
          valA = a.candidate_info?.state?.toLowerCase() || '';
          valB = b.candidate_info?.state?.toLowerCase() || '';
          break;
        case 'time_used':
          valA = a.time_used || 0;
          valB = b.time_used || 0;
          break;
        case 'violation_score':
          valA = a.violation_score || 0;
          valB = b.violation_score || 0;
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rankingData, searchTerm, sortConfig, filterState]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 w-full">
        <Spinner size={40} color="#3E4095" />
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
          className="mt-6 px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold text-sm hover:bg-[#2d2f6e] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const activeFiltersCount = Object.values(filterState).filter(val => val !== 'All States' && val !== 'All Types' && val !== 'All Classes').length;

  return (
    <div className={clsx("flex flex-col w-full font-sans max-w-7xl mx-auto", containerClassName)}>
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-[#f0f2f5] pt-4 pb-4 flex flex-col gap-6">
        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f0f2f5] px-1">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
            >
              <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform"><AngleIcon width={8} height={14} /></div>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#3E4095] rounded-full"></div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">Ranking: {displayTitle}</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed results for this exam</p>
              </div>
            </div>
          </div>

          {responseData && !isPublicView && (
            <div
              title="Exam Ranking Configuration & Status"
              className="grid grid-cols-2 lg:flex lg:items-center gap-y-4 gap-x-0 px-5 py-4 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div
                className="flex flex-col items-center justify-center px-4 border-r border-gray-100"
                title={responseData.is_published ? "Live to candidates" : "Internal view only (Draft)"}
              >
                <div className="flex items-center gap-1.5 h-3">
                    <div className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", responseData.is_published ? "bg-emerald-500" : "bg-amber-500")}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">
                    {responseData.is_published ? "Published" : "Draft"}
                    </span>
                </div>
              </div>

              <div
                className="flex flex-col justify-center items-center px-4 lg:border-r border-gray-100"
                title={responseData.meta?.ranking_policy === "standard" ? "Candidates with same score share same rank" : "Candidates with same score are ranked based on submission time"}
              >
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">Policy</span>
                <span className="text-[10px] font-black text-[#3E4095] uppercase leading-none h-3">{responseData.meta?.ranking_policy|| 'Standard'}</span>
              </div>

              <div
                className="flex flex-col justify-center items-center px-4 border-r lg:border-r border-gray-100 lg:last:border-r-0"
                title="How ties are resolved when candidates share the same score"
              >
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">
                  Ties Resolved By
                </span>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight leading-none h-3">
                  {responseData.meta?.tie_break_strategy === 'dense' ? 'Submission Time' : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center px-4" title={`Ranking was made public on ${formatDateTime(responseData.published_at)}`}>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1 text-center">Published Date</span>
                <span className="text-[10px] font-black text-gray-600 leading-none h-3 text-center">
                  {responseData.published_at ? new Date(responseData.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "--:--"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm gap-4">
          <div className="relative group">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
            <input
              value={searchTerm}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search candidate, school, or email..."
              className="bg-gray-50/50 border border-gray-100 h-11 pl-11 pr-4 py-2 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-semibold w-full md:w-80 shadow-inner"
            />
          </div>
          { !isPublicView &&
            <div className="flex items-center gap-3">
             <DropdownMenu.Root>
               <DropdownMenu.Trigger asChild>
                 <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 h-11 rounded-xl px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                    <SortIcon className="w-4 h-4" />
                    <span>Sort: {sortConfig.key}</span>
                 </button>
               </DropdownMenu.Trigger>
               <DropdownMenu.Portal>
                 <DropdownMenu.Content className="z-50 min-w-[180px] bg-white rounded-2xl p-2 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={8}>
                   <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Sort By</DropdownMenu.Label>
                   {[
                     { label: 'Rank', key: 'rank' as SortKey },
                     { label: 'Score', key: 'score' as SortKey },
                     { label: 'Percentile', key: 'percentile' as SortKey },
                     ...(!isPublicView ? [
                        { label: 'Time Used', key: 'time_used' as SortKey },
                        { label: 'Violation Score', key: 'violation_score' as SortKey }
                     ] : []),
                     { label: 'Name', key: 'name' as SortKey },
                     { label: 'School', key: 'school' as SortKey },
                     { label: 'Class', key: 'class' as SortKey},
                     { label: 'State', key: 'state' as SortKey},
                   ].map((option) => (
                     <DropdownMenu.Item
                       key={option.key}
                       onClick={() => handleSort(option.key)}
                       className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors ${
                         sortConfig.key === option.key ? 'bg-blue-50 text-[#3E4095]' : 'text-gray-600 hover:bg-gray-50'
                       }`}
                     >
                       {option.label}
                       {sortConfig.key === option.key && (
                         <span className="text-[10px]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                       )}
                     </DropdownMenu.Item>
                   ))}
                 </DropdownMenu.Content>
               </DropdownMenu.Portal>
             </DropdownMenu.Root>

             <DropdownMenu.Root>
               <DropdownMenu.Trigger asChild>
                 <button className={`inline-flex items-center justify-center gap-2 h-11 rounded-xl px-4 transition-all font-bold text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer border ${
                   activeFiltersCount > 0
                    ? 'bg-[#3E4095]/5 border-[#3E4095]/40 text-[#3E4095]'
                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                 }`}>
                    <FilterIcon className="w-4 h-4" />
                    <span>Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                 </button>
               </DropdownMenu.Trigger>
               <DropdownMenu.Portal>
                 <DropdownMenu.Content className="z-50 min-w-[220px] bg-white rounded-2xl p-3 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={8}>
                   <div className="flex flex-col gap-4">
                     <div className="flex flex-col gap-1.5">
                       <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">State</label>
                       <select
                         value={filterState.state}
                         onChange={(e) => setFilterState(prev => ({ ...prev, state: e.target.value }))}
                         className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                       >
                         {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                     </div>

                     <div className="flex flex-col gap-1.5">
                       <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">School Type</label>
                       <select
                         value={filterState.schoolType}
                         onChange={(e) => setFilterState(prev => ({ ...prev, schoolType: e.target.value }))}
                         className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                       >
                         {filterOptions.schoolTypes.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                     </div>

                     {!isPublicView && (
                       <div className="flex flex-col gap-1.5">
                         <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Class</label>
                         <select
                           value={filterState.currentClass}
                           onChange={(e) => setFilterState(prev => ({ ...prev, currentClass: e.target.value }))}
                           className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                         >
                           {filterOptions.currentClasses.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                       </div>
                     )}

                     <button
                       onClick={() => setFilterState({ state: 'All States', schoolType: 'All Types', currentClass: 'All Classes' })}
                       className="w-full mt-1 py-2 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors"
                     >
                       Reset Filters
                     </button>
                   </div>
                 </DropdownMenu.Content>
               </DropdownMenu.Portal>
             </DropdownMenu.Root>
            </div>
          }
        </div>
      </div>

      {/* Table Card Area */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden mb-8">
        <div className="py-8 px-0">
          <CustomTable<RankingEntry>
            data={processedData}
            getRowId={(row) => row.candidate}
            minWidth="1000px"
            emptyLabel="No matches found"
            emptyDesc="Try adjusting your search or filters to find what you're looking for."
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
                    <span className="text-sm font-black text-[#3E4095] bg-gray-100/50 px-3 py-1 rounded-lg"># {val}</span>
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
              ...(!isPublicView ? [
                {
                  key: 'time_used',
                  header: 'Time Used',
                  render: (val: any) => (
                    <div className="flex justify-center">
                      <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                        {val ? formatTime(Number(val)) : '-'}
                      </span>
                    </div>
                  ),
                  align: 'center' as const
                }
              ] : []),
              {
                key: 'percentile',
                header: 'Percentile',
                render: (val) => (
                  <div className="flex justify-center">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                      {val ? `${Number(val).toFixed(1)}th` : '-'}
                    </span>
                  </div>
                ),
                align: 'center'
              },
              ...(!isPublicView ? [
                {
                  key: 'proctoring_status',
                  header: 'Proctoring',
                  render: (val: any, row: RankingEntry) => {
                    const score = (row.violation_score || 0) * 100;
                    const isAbsent = typeof row.exam_score === 'string' && row.exam_score.toLowerCase() === 'absent';

                    if (isAbsent || val === null) {
                      return (
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-gray-400 uppercase tracking-tighter">
                            N/A
                          </span>
                          <div className="w-12 h-1 bg-gray-100 rounded-full" />
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-col items-center gap-1">
                        <span className={clsx(
                          "text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter",
                          val === 'clear' ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                          val === 'suspicious' ? "text-amber-600 bg-amber-50 border-amber-100" :
                          "text-rose-600 bg-rose-50 border-rose-100 animate-pulse"
                        )}>
                          {val || 'clear'}
                        </span>
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              "h-full transition-all duration-1000",
                              score > 70 ? "bg-rose-500" : score > 30 ? "bg-amber-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                  align: 'center' as const
                }
              ] : []),
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
              ...(!isPublicView ? [
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
        </div>
      </div>
    </div>
  );
};

export default FullRanking;

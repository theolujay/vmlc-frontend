/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon, FilterIcon, SortIcon } from '../AdminIcons';
import Image from "next/image";
import RankMedal from './RankMedal';
import useGetLeagueLeaderboard from '@/hooks/useGetLeagueLeaderboard';
import { LeagueLeaderboardEntry, LeagueLeaderboardResponse } from '@/types/ScoreboardType';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import Spinner from "@/components/ui/spinner/spinner";

const RankChangeIndicator = ({ change }: { change: number }) => {
  if (change === 0) return <span className="text-gray-400 font-medium">-</span>;
  if (change > 0) return <span className="text-green-600 font-bold text-xs">▲ {change}</span>;
  return <span className="text-red-600 font-bold text-xs">▼ {Math.abs(change)}</span>;
}

interface FullLeagueLeaderboardProps {
  onBack: () => void;
  onViewDetails?: (candidateId: string) => void;
  isPublicView?: boolean;
}

type SortKey = "rank" | "name" | "school" | "class" | "state" | "score" | "trend";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface FilterState {
  state: string;
  schoolType: string;
  currentClass: string;
}

const FullLeagueLeaderboard: React.FC<FullLeagueLeaderboardProps> = ({ onBack, onViewDetails, isPublicView = false }) => {
  const [searchTerm, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "rank",
    direction: "asc",
  });
  const [filterState, setFilterState] = useState<FilterState>({
    state: "All States",
    schoolType: "All Types",
    currentClass: "All Classes",
  });

  const { data, isLoading, error, refetch } = useGetLeagueLeaderboard();

  const leaderboardData = useMemo(() => (data as unknown as LeagueLeaderboardResponse)?.entries || [], [data]);

  const filterOptions = useMemo(() => {
    const states = new Set<string>();
    const types = new Set<string>();
    const classes = new Set<string>();

    leaderboardData.forEach((item) => {
      if (item.candidate_info?.state) states.add(item.candidate_info.state);
      if (item.candidate_info?.school_type) types.add(item.candidate_info.school_type);
      if (item.candidate_info?.current_class) classes.add(item.candidate_info.current_class);
    });

    return {
      states: ["All States", ...Array.from(states).sort()],
      schoolTypes: ["All Types", ...Array.from(types).sort()],
      currentClasses: ["All Classes", ...Array.from(classes).sort()],
    };
  }, [leaderboardData]);

  const processedData = useMemo(() => {
    const result = [...leaderboardData].filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        (item.candidate_info?.full_name?.toLowerCase() || "").includes(searchStr) ||
        (item.candidate_info?.school_name?.toLowerCase() || "").includes(searchStr) ||
        (item.candidate_info?.email?.toLowerCase() || "").includes(searchStr);

      const matchesState =
        filterState.state === "All States" ||
        item.candidate_info?.state === filterState.state;
      const matchesSchoolType =
        filterState.schoolType === "All Types" ||
        item.candidate_info?.school_type === filterState.schoolType;
      const matchesClass =
        filterState.currentClass === "All Classes" ||
        item.candidate_info?.current_class === filterState.currentClass;

      return matchesSearch && matchesState && matchesSchoolType && matchesClass;
    });

    result.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortConfig.key) {
        case "rank":
          valA = a.overall_rank;
          valB = b.overall_rank;
          break;
        case "score":
          valA = parseFloat(a.total_score) || 0;
          valB = parseFloat(b.total_score) || 0;
          break;
        case "trend":
          valA = a.rank_change || 0;
          valB = b.rank_change || 0;
          break;
        case "name":
          valA = a.candidate_info?.full_name?.toLowerCase() || "";
          valB = b.candidate_info?.full_name?.toLowerCase() || "";
          break;
        case "school":
          valA = a.candidate_info?.school_name?.toLowerCase() || "";
          valB = b.candidate_info?.school_name?.toLowerCase() || "";
          break;
        case "class":
          valA = a.candidate_info?.current_class?.toLowerCase() || "";
          valB = b.candidate_info?.current_class?.toLowerCase() || "";
          break;
        case "state":
          valA = a.candidate_info?.state?.toLowerCase() || "";
          valB = b.candidate_info?.state?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [leaderboardData, searchTerm, sortConfig, filterState]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <Spinner size={40} color="#3E4095" />
        <p className="mt-4 text-sm text-grey-500 font-medium animate-pulse">Loading Leaderboard...</p>
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
        <p className="text-sm text-grey-500 mt-1 max-w-xs mx-auto">There was an error retrieving the ranking data. Please try again.</p>
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const activeFiltersCount = Object.values(filterState).filter(
    (val) => val !== "All States" && val !== "All Types" && val !== "All Classes",
  ).length;

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onBack}
          className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
        >
          <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform"><AngleIcon width={8} height={14} /></div>
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#101828]">League Leaderboard</h1>
          <p className="text-xs text-grey-500">Cumulative scores across all published rankings</p>
        </div>
      </div>

      <ResponsiveContainer className="flex flex-col gap-4">
        {/* Controls Area */}
        <div className="flex flex-row items-center justify-between p-2 sm:p-4 bg-white border border-gray-100 rounded-2xl shadow-sm gap-2 sm:gap-4">
          <div className="relative group flex-1">
            <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-[10px] sm:text-xs"></i>
            <input
              value={searchTerm}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search..."
              className="bg-gray-50/50 border border-gray-100 h-9 sm:h-11 pl-8 sm:pl-11 pr-2 sm:pr-4 py-2 rounded-lg sm:rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-xs sm:text-sm font-semibold w-full shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-white border border-gray-100 h-9 sm:h-11 rounded-lg sm:rounded-xl px-2 sm:px-4 text-gray-600 hover:bg-gray-50 transition-all font-bold text-[9px] sm:text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer">
                  <SortIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sort</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-40 bg-white rounded-2xl p-2 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenu.Label className="px-3 py-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Sort By
                  </DropdownMenu.Label>
                  {[
                    { label: "Rank", key: "rank" as SortKey },
                    { label: "Score", key: "score" as SortKey },
                    { label: "Trend", key: "trend" as SortKey },
                    { label: "Name", key: "name" as SortKey },
                    { label: "School", key: "school" as SortKey },
                    { label: "Class", key: "class" as SortKey },
                    { label: "State", key: "state" as SortKey },
                  ].map((option) => (
                    <DropdownMenu.Item
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className={clsx(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors",
                        sortConfig.key === option.key ? "bg-blue-50 text-[#3E4095]" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {option.label}
                      {sortConfig.key === option.key && (
                        <span className="text-[10px]">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className={clsx(
                    "inline-flex items-center justify-center gap-1 sm:gap-2 h-9 sm:h-11 rounded-lg sm:rounded-xl px-2 sm:px-4 transition-all font-bold text-[9px] sm:text-[10px] uppercase tracking-widest shadow-sm outline-none cursor-pointer border",
                    activeFiltersCount > 0
                      ? "bg-[#3E4095]/5 border-[#3E4095]/40 text-[#3E4095]"
                      : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <FilterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFiltersCount > 0 && <span className="ml-0.5 sm:ml-1">({activeFiltersCount})</span>}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-48 sm:min-w-55 bg-white rounded-2xl p-3 shadow-2xl border border-gray-50 animate-in fade-in zoom-in-95 duration-200"
                  align="end"
                  sideOffset={8}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        State
                      </label>
                      <select
                        value={filterState.state}
                        onChange={(e) => setFilterState((prev) => ({ ...prev, state: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                      >
                        {filterOptions.states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        School Type
                      </label>
                      <select
                        value={filterState.schoolType}
                        onChange={(e) => setFilterState((prev) => ({ ...prev, schoolType: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                      >
                        {filterOptions.schoolTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="px-1 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Class
                      </label>
                      <select
                        value={filterState.currentClass}
                        onChange={(e) => setFilterState((prev) => ({ ...prev, currentClass: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                      >
                        {filterOptions.currentClasses.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => setFilterState({ state: "All States", schoolType: "All Types", currentClass: "All Classes" })}
                      className="w-full mt-1 py-2 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        <CustomTable<LeagueLeaderboardEntry>
          data={processedData}
          getRowId={(row) => row.candidate}
          minWidth="900px"
          emptyLabel="Leaderboard Empty"
          emptyDesc="No rankings have been generated for this stage yet."
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
              key: 'overall_rank',
              header: 'Rank',
              render: (val) => (
                <div className="flex items-center justify-center">
                  <span className="text-sm font-black text-[#3E4095] bg-gray-100/50 px-3 py-1 rounded-lg"># {val}</span>
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
                    <RankMedal rank={row.overall_rank} className="absolute -bottom-1 -right-1 drop-shadow-md" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-gray-800 text-sm">{val?.full_name}</span>
                    {!isPublicView && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{val?.email}</span>}
                  </div>
                </div>
              )
            },
            {
              key: 'candidate_info',
              header: 'School',
              align: 'left',
              render: (val: any) => (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700 font-bold">{val?.school_name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{val?.school_type}</span>
                </div>
              )
            },
            {
              key: 'total_score',
              header: 'Cumulative',
              render: (val) => {
                const isAbsent = typeof val === 'string' && val.toLowerCase() === 'absent';
                return (
                  <div className="flex justify-center">
                    <span className={`text-[11px] font-black px-2 py-1.5 rounded-full border uppercase transition-all ${
                      isAbsent
                        ? "text-gray-400 bg-gray-50 border-gray-200 tracking-tight"
                        : "text-[#3E4095] bg-[#FFFFFF] border-[#3E4095]/40 shadow-sm shadow-emerald-500/5 tracking-widest"
                    }`}>
                      {isAbsent ? "Absent" : val}
                    </span>
                  </div>
                );
              },
              align: 'center'
            },
            ...(onViewDetails ? [{
              key: 'action',
              header: 'Action',
              render: (_: any, row: LeagueLeaderboardEntry) => (
                <div className="flex justify-center">
                  <button
                    onClick={() => onViewDetails?.(row.candidate)}
                    className="bg-[#3E4095] text-white font-black px-5 py-2 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#2d2f6e] transition-all shadow-md shadow-[#3E4095]/10 active:scale-95"
                  >
                    View Details
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

export default FullLeagueLeaderboard;

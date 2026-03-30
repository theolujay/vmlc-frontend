/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import CustomTable from '@/components/ui/CustomTable';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { AngleIcon } from '../AdminIcons';
import useGetLeagueLeaderboard from '@/hooks/useGetLeagueLeaderboard';
import { LeagueLeaderboardEntry, LeagueLeaderboardResponse } from '@/types/ScoreboardType';
import { CompetitionControls } from './CompetitionControls';
import { BadgeCell, CandidateCell, RankCell, SchoolCell, SNCell, ViewDetailsButton } from './CompetitionTableCells';
import { LoadingView, ErrorView } from './CompetitionStatusViews';

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

const FullLeagueLeaderboard: React.FC<FullLeagueLeaderboardProps> = ({ onBack, onViewDetails, isPublicView = false }) => {
  const [searchTerm, setSearchInput] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });
  const [filterState, setFilterState] = useState({
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
    return <LoadingView message="Loading Leaderboard..." />;
  }

  if (error) {
    return (
      <ErrorView 
        title="Failed to load leaderboard" 
        description="There was an error retrieving the ranking data. Please try again." 
        onRetry={refetch} 
      />
    );
  }

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

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
          <p className="text-xs text-gray-500">Cumulative scores across all published rankings</p>
        </div>
      </div>

      <ResponsiveContainer className="flex flex-col gap-4">
        <CompetitionControls
          searchTerm={searchTerm}
          onSearchChange={setSearchInput}
          sortKey={sortConfig.key}
          sortDirection={sortConfig.direction}
          onSort={(key) => handleSort(key as SortKey)}
          sortOptions={[
            { label: "Rank", key: "rank" },
            { label: "Score", key: "score" },
            { label: "Trend", key: "trend" },
            ...(!isPublicView
              ? [
                  { label: "Class", key: "class" },
                  { label: "State", key: "state" },
                ]
              : []),
            { label: "Name", key: "name" },
            { label: "School", key: "school" },
          ]}
          filterState={filterState}
          onFilterChange={(newFilters) => setFilterState((prev) => ({ ...prev, ...newFilters }))}
          filterOptions={filterOptions}
          onResetFilters={() => setFilterState({ state: "All States", schoolType: "All Types", currentClass: "All Classes" })}
          isPublicView={isPublicView}
        />

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
              render: (_, __, index) => SNCell(index),
              align: 'center'
            },
            {
              key: 'overall_rank',
              header: 'Rank',
              render: (val) => RankCell(val as number),
              align: 'center'
            },
            {
              key: 'rank_change',
              header: 'Trend',
              render: (val) => <RankChangeIndicator change={val as number} />,
              align: 'center'
            },
            {
              key: 'candidate_info',
              header: 'Candidate',
              render: (val: any, row) => (
                <CandidateCell
                  info={val}
                  profile_picture={row.profile_picture}
                  rank={row.overall_rank}
                  isPublicView={isPublicView}
                />
              )
            },
            {
              key: 'candidate_info',
              header: 'School',
              align: 'left',
              render: (val: any) => SchoolCell(val, isPublicView)
            },
            {
              key: 'total_score',
              header: 'Cumulative',
              render: (val) => {
                const isAbsent = typeof val === 'string' && val.toLowerCase() === 'absent';
                return (
                  <BadgeCell
                    label={isAbsent ? "Absent" : (val as string | number)}
                    variant={isAbsent ? 'absent' : 'default'}
                  />
                );
              },
              align: 'center'
            },
            ...(onViewDetails ? [{
              key: 'action',
              header: 'Action',
              render: (_: any, row: LeagueLeaderboardEntry) => (
                <ViewDetailsButton 
                  onClick={() => onViewDetails?.(row.candidate)} 
                  label="View Details" 
                />
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

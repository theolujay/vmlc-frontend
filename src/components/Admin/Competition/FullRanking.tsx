/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import CustomTable from "@/components/ui/CustomTable";
import { AngleIcon } from "../AdminIcons";
import useGetRanking from "@/hooks/useGetRanking";
import { RankingEntry } from "@/types/ScoreboardType";
import clsx from "clsx";
import { formatDateTime } from "@/utils/formatFileSize";
import { formatTime } from "@/utils/formatTime";
import { CompetitionControls } from "./CompetitionControls";
import { BadgeCell, CandidateCell, RankCell, SchoolCell, SNCell, ViewDetailsButton } from "./CompetitionTableCells";
import { LoadingView, ErrorView } from "./CompetitionStatusViews";
import useGetCurrentUser from "@/hooks/useGetCurrentUser";

interface FullRankingProps {
  onBack: () => void;
  examId: string;
  examTitle: string;
  onViewDetails?: (candidateId: string) => void;
  isPublicView?: boolean;
  containerClassName?: string;
}

type SortKey =
  | "rank"
  | "name"
  | "school"
  | "class"
  | "state"
  | "score"
  | "percentile"
  | "time_used"
  | "violation_score";

const FullRanking: React.FC<FullRankingProps> = ({
  onBack,
  examId,
  examTitle,
  onViewDetails,
  isPublicView = false,
  containerClassName,
}) => {
  const authState = useGetCurrentUser();
  const currentUserId = authState?.user?.id;

  const [searchTerm, setSearchInput] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "rank",
    direction: "asc",
  });
  const [filterState, setFilterState] = useState({
    state: "All States",
    schoolType: "All Types",
    currentClass: "All Classes",
  });

  const { data, isLoading, error, refetch } = useGetRanking(examId);

  const rankingData = useMemo(() => data?.entries || [], [data]);
  const responseData = data;

  const displayTitle =
    examTitle ||
    (responseData
      ? `${responseData.stage_display} ${responseData.round ? `- Round ${responseData.round}` : ""}`
      : "Ranking");

  const filterOptions = useMemo(() => {
    const states = new Set<string>();
    const types = new Set<string>();
    const classes = new Set<string>();

    rankingData.forEach((item) => {
      if (item.candidate_info?.state) states.add(item.candidate_info.state);
      if (item.candidate_info?.school_type)
        types.add(item.candidate_info.school_type);
      if (item.candidate_info?.current_class)
        classes.add(item.candidate_info.current_class);
    });

    return {
      states: ["All States", ...Array.from(states).sort()],
      schoolTypes: ["All Types", ...Array.from(types).sort()],
      currentClasses: ["All Classes", ...Array.from(classes).sort()],
    };
  }, [rankingData]);

  const processedData = useMemo(() => {
    const result = [...rankingData].filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        (item.candidate_info?.full_name?.toLowerCase() || "").includes(
          searchStr,
        ) ||
        (item.candidate_info?.school_name?.toLowerCase() || "").includes(
          searchStr,
        ) ||
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
          valA = a.rank;
          valB = b.rank;
          break;
        case "score":
          valA = typeof a.exam_score === "string" ? -1 : a.exam_score;
          valB = typeof b.exam_score === "string" ? -1 : b.exam_score;
          break;
        case "percentile":
          valA = a.percentile || 0;
          valB = b.percentile || 0;
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
        case "time_used":
          valA = a.time_used || 0;
          valB = b.time_used || 0;
          break;
        case "violation_score":
          valA = a.violation_score || 0;
          valB = b.violation_score || 0;
          break;
        default:
          return 0;
      }

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [rankingData, searchTerm, sortConfig, filterState]);

  if (isLoading) {
    return <LoadingView message="Loading Ranking..." />;
  }

  if (error) {
    return (
      <ErrorView 
        title="Failed to load ranking" 
        description="There was an error retrieving the result data for this exam. Please try again." 
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
    <div
      className={clsx(
        "flex flex-col w-full font-sans max-w-7xl mx-auto",
        containerClassName,
      )}
    >
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-30 bg-grey-100 pt-4 pb-4 flex flex-col gap-6">
        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-grey-100 px-1">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
            >
              <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform">
                <AngleIcon width={8} height={14} />
              </div>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#3E4095] rounded-full"></div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                  Ranking: {displayTitle}
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Detailed results for this exam
                </p>
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
                title={
                  responseData.is_published
                    ? "Live to candidates"
                    : "Internal view only (Draft)"
                }
              >
                <div className="flex items-center gap-1.5 h-3">
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      responseData.is_published
                        ? "bg-emerald-500"
                        : "bg-amber-500",
                    )}
                  ></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">
                    {responseData.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div
                className="flex flex-col justify-center items-center px-4 lg:border-r border-gray-100"
                title={
                  responseData.meta?.ranking_policy === "standard"
                    ? "Candidates with same score share same rank"
                    : "Candidates with same score are ranked based on submission time"
                }
              >
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">
                  Policy
                </span>
                <span className="text-[10px] font-black text-[#3E4095] uppercase leading-none h-3">
                  {responseData.meta?.ranking_policy || "Standard"}
                </span>
              </div>

              <div
                className="flex flex-col justify-center items-center px-4 border-r lg:border-r border-gray-100 lg:last:border-r-0"
                title="How ties are resolved when candidates share the same score"
              >
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">
                  Ties Resolved By
                </span>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight leading-none h-3">
                  {responseData.meta?.tie_break_strategy === "dense"
                    ? "Submission Time"
                    : "N/A"}
                </span>
              </div>
              <div
                className="flex flex-col justify-center items-center px-4"
                title={`Ranking was made public on ${formatDateTime(responseData.published_at)}`}
              >
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1 text-center">
                  Published Date
                </span>
                <span className="text-[10px] font-black text-gray-600 leading-none h-3 text-center">
                  {responseData.published_at
                    ? new Date(responseData.published_at).toLocaleDateString(
                        undefined,
                        { day: "numeric", month: "short", year: "numeric" },
                      )
                    : "--:--"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <CompetitionControls
          searchTerm={searchTerm}
          onSearchChange={setSearchInput}
          sortKey={sortConfig.key}
          sortDirection={sortConfig.direction}
          onSort={(key) => handleSort(key as SortKey)}
          sortOptions={[
            { label: "Rank", key: "rank" },
            { label: "Score", key: "score" },
            { label: "Percentile", key: "percentile" },
            ...(!isPublicView
              ? [
                  { label: "Time Used", key: "time_used" },
                  { label: "Violation Score", key: "violation_score" },
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
      </div>

      {/* Table Card Area */}
      <div className="bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden mb-8">
        <div className="py-8 px-0">
          <CustomTable<RankingEntry>
            data={processedData}
            getRowId={(row) => row.candidate}
            minWidth="1000px"
            emptyLabel="No matches found"
            emptyDesc="Try adjusting your search or filters to find what you're looking for."
            columns={[
              {
                key: "sn",
                header: "S/N",
                render: (_, __, index) => SNCell(index),
                align: "center",
              },
              {
                key: "rank",
                header: "Rank",
                render: (val) => RankCell(val as number),
                align: "center",
              },
              {
                key: "candidate_info",
                header: "Candidate",
                render: (val: any, row) => (
                  <CandidateCell 
                    info={val} 
                    profile_picture={row.profile_picture} 
                    rank={row.rank} 
                    isPublicView={isPublicView} 
                    isCurrentUser={row.candidate === currentUserId}
                  />
                ),
                align: "left",
              },
              {
                key: "exam_score",
                header: "Score (%)",
                render: (val, row: RankingEntry) => {
                  const isAbsent = row.attempt_status === "absent";
                  const isDisqualified = row.attempt_status === "disqualified";
                  return (
                    <BadgeCell 
                      label={isAbsent ? "ABSENT" : isDisqualified ? "DQ" : (val as string | number)} 
                      variant={isAbsent ? 'absent' : isDisqualified ? 'disqualified' : 'default'} 
                    />
                  );
                },
                align: "center",
              },
              ...(!isPublicView
                ? [
                    {
                      key: "time_used",
                      header: "Time Used",
                      render: (val: any) => (
                        <div className="flex justify-center">
                          <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                            {val ? formatTime(Number(val)) : "-"}
                          </span>
                        </div>
                      ),
                      align: "center" as const,
                    },
                  ]
                : []),
              {
                key: "percentile",
                header: "Percentile",
                render: (val) => (
                  <div className="flex justify-center">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                      {val ? `${Number(val).toFixed(1)}th` : "-"}
                    </span>
                  </div>
                ),
                align: "center",
              },
              ...(!isPublicView
                ? [
                    {
                      key: "proctoring_status",
                      header: "Proctoring (beta)",
                      render: (val: any, row: RankingEntry) => {
                        const score = (row.violation_score || 0) * 100;
                        const isAbsent = row.attempt_status === "absent";
                        const isDisqualified =
                          row.attempt_status === "disqualified";

                        if (isAbsent || isDisqualified || val === null) {
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
                            <span
                              className={clsx(
                                "text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter",
                                val === "clear"
                                  ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                  : val === "suspicious"
                                    ? "text-amber-600 bg-amber-50 border-amber-100"
                                    : "text-rose-600 bg-rose-50 border-rose-100 animate-pulse",
                              )}
                            >
                              {val || "clear"}
                            </span>
                            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={clsx(
                                  "h-full transition-all duration-1000",
                                  score >= 70
                                    ? "bg-rose-500"
                                    : score >= 30
                                      ? "bg-amber-500"
                                      : "bg-emerald-500",
                                )}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                      align: "center" as const,
                    },
                  ]
                : []),
              {
                key: "candidate_info",
                header: "School",
                render: (val: any) => SchoolCell(val, isPublicView),
              },
              ...(!isPublicView
                ? [
                    {
                      key: "candidate_info",
                      header: "Class",
                      render: (val: any) => (
                        <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-widest">
                          {val?.current_class}
                        </span>
                      ),
                      align: "center" as const,
                    },
                    {
                      key: "candidate_info",
                      header: "State",
                      render: (val: any) => (
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {val?.state}
                        </span>
                      ),
                      align: "center" as const,
                    },
                  ]
                : []),
              ...(onViewDetails && !isPublicView
                ? [
                    {
                      key: "details",
                      header: "Details",
                      render: (_: any, row: RankingEntry) => (
                        <ViewDetailsButton onClick={() => onViewDetails?.(row.candidate)} />
                      ),
                      align: "center" as const,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default FullRanking;

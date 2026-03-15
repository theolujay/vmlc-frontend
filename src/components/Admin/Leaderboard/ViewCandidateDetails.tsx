import CustomTable from "@/components/ui/CustomTable";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import useGetCompetitionCandidateDetail from "@/hooks/useGetCompetitionCandidateDetail";
import { formatDateTime } from "@/utils/formatFileSize";
import { formatTime } from "@/utils/formatTime";
import { getOrdinal } from "@/utils/generalUtils";
import { getUserInitials } from "@/utils/capitalizeWords";
import clsx from "clsx";
import { AngleIcon, CandidateIcon, SortIcon, FilterIcon } from "../AdminIcons";
import {
  EndTimeIcon,
  PositionIcon,
  StartTimeIcon,
  ExamScoreIcon,
} from "./LeaderBoardIcon";
import { ReactNode, useState } from "react";
import Image from "next/image";
import MathRenderer from "@/components/Exam/MathRenderer";
import RankMedal from "../Competition/RankMedal";
import ProfileModal from "@/components/Modals/ProfileModal";
import useGetAccountMgt from "@/hooks/useGetAccountMgt";
import useGetIntegrityAudit from "@/hooks/useGetIntegrityAudit";
import useUpdateProctoringStatus from "@/hooks/useUpdateProctoringStatus";
import { SubmissionItem } from "@/types/ScoreboardType";
import {
  IntegrityAuditResponse,
  TimelineEntry,
  ProctoringStatus,
  ViolationEvent,
  ProctoringSummary,
} from "@/types/ViolationType";

interface ViewCandidateDetailsProps {
  candidate_id: string;
  exam_id?: string;
  isLeagueCumulative?: boolean;
  stage?: string;
  round?: string;
  onBack?: () => void;
}

function ViewProfileButton({
  role,
  onOpen,
}: {
  role: string;
  onOpen: () => void;
}): ReactNode {
  switch (role) {
    case "volunteer":
    case "moderator":
      return <></>;

    case "admin":
    case "manager":
    case "superadmin":
      return (
        <button
          onClick={onOpen}
          className="inline-flex gap-2 border border-[#D0D5DD] px-4 cursor-pointer py-2 font-bold uppercase rounded-full transition-colors duration-200 items-center text-xs bg-white hover:bg-gray-50 outline-none"
        >
          <span>
            <CandidateIcon className="w-4 h-4" />
          </span>
          <span>View Profile</span>
        </button>
      );

    default:
      return <></>;
  }
}

export default function ViewCandidateDetails({
  candidate_id,
  exam_id,
  isLeagueCumulative,
  onBack,
}: ViewCandidateDetailsProps) {
  const { data: accountMgt } = useGetAccountMgt();
  const [profileOpen, setProfileOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  const { data, isLoading } = useGetCompetitionCandidateDetail({
    candidate_id,
    exam_id,
    isLeagueCumulative,
  });

  const { data: auditData, isLoading: auditLoading } = useGetIntegrityAudit(
    exam_id,
    candidate_id,
    true,
  );
  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateProctoringStatus(exam_id, candidate_id);

  const isRanking = !!exam_id && !isLeagueCumulative;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E4095]"></div>
      </div>
    );
  }

  const performanceData = isRanking ? data?.candidate_performance : data;
  const examDetails = isRanking ? data?.exam_details : null;
  const candidateInfo = isRanking ? data?.candidate_info : null;

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
            >
              <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform">
                <AngleIcon width={8} height={14} />
              </div>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#3E4095] rounded-full"></div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                {isRanking ? "Exam Performance" : "League Performance"}
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {isRanking
                  ? `${examDetails?.title || "Performance Details"}`
                  : "Cumulative Performance"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <ViewProfileButton
            role={accountMgt?.role || ""}
            onOpen={() => setProfileOpen(true)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <CandidateInfoCard
          endTime={
            performanceData?.submitted_at ||
            performanceData?.recorded_at ||
            performanceData?.participated_at
          }
          startTime={performanceData?.started_at || examDetails?.scheduled_date}
          position={performanceData?.rank || performanceData?.overall_rank || 0}
          userName={
            candidateInfo?.full_name ||
            performanceData?.candidate_name ||
            performanceData?.candidate?.full_name ||
            ""
          }
          profilePicture={performanceData?.candidate?.profile_picture || null}
          faceCapture={performanceData?.face_capture}
          score={performanceData?.score || performanceData?.total_score}
          isLeague={isLeagueCumulative}
          rankChange={performanceData?.rank_change}
          schoolName={
            candidateInfo?.school_name || performanceData?.school_name
          }
          candidateEmail={
            candidateInfo?.email || performanceData?.candidate_email
          }
          state={candidateInfo?.state}
          percentile={performanceData?.percentile}
          currentClass={candidateInfo?.current_class}
          timeUsed={performanceData?.time_used}
          proctoringSummary={
            performanceData?.proctoring_summary || auditData?.proctoring_summary
          }
          auditLoading={auditLoading && auditOpen}
          auditOpen={auditOpen}
          onAuditToggle={() => setAuditOpen(!auditOpen)}
        />

        {isRanking && auditOpen && auditData && (
          <IntegrityAuditTimeline
            auditData={auditData}
            submissions={performanceData?.submissions || []}
            onUpdateStatus={(status) => status && updateStatus(status)}
            isUpdating={updatingStatus}
          />
        )}

        {isRanking && performanceData?.submissions && (
          <QuestionsTable questions={performanceData.submissions} />
        )}

        {isLeagueCumulative && (
          <ResponsiveContainer className="p-8 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
              <PositionIcon className="w-8 h-8 text-[#3E4095]" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-[#101828]">
                Cumulative League View
              </h3>
              <p className="text-sm text-grey-500 mt-1">
                You are viewing the cumulative performance of{" "}
                {performanceData?.candidate_name} across all published league
                rounds. Detailed answer breakdowns are available in the specific
                round ranking.
              </p>
            </div>
          </ResponsiveContainer>
        )}
      </div>

      <ProfileModal
        id={candidate_id}
        open={profileOpen}
        close={setProfileOpen}
        isOwnProfile={false}
      />
    </div>
  );
}

function CandidateInfoCard({
  userName,
  position,
  startTime,
  endTime,
  profilePicture,
  faceCapture,
  score,
  isLeague,
  rankChange,
  schoolName,
  candidateEmail,
  state,
  percentile,
  currentClass,
  timeUsed,
  proctoringSummary,
  auditLoading,
  auditOpen,
  onAuditToggle,
}: {
  userName: string;
  position: number;
  startTime?: string | Date;
  endTime?: string | Date;
  profilePicture: string | null;
  faceCapture?: string | null;
  score?: string | number;
  isLeague?: boolean;
  rankChange?: number;
  schoolName?: string;
  candidateEmail?: string;
  state?: string;
  percentile?: number | null;
  currentClass?: string;
  timeUsed?: number | null;
  proctoringSummary?: ProctoringSummary;
  auditLoading?: boolean;
  auditOpen?: boolean;
  onAuditToggle?: () => void;
}) {
  const userInitials = getUserInitials(userName);
  const isAbsent =
    typeof score === "string" && score.toLowerCase() === "absent";
  const numericScore = isAbsent
    ? null
    : typeof score === "string"
      ? parseFloat(score)
      : score;
  const hasScore =
    numericScore !== undefined &&
    numericScore !== null &&
    !isNaN(numericScore as number);

  return (
    <ResponsiveContainer className="flex gap-6 flex-col p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-sm text-grey-600 uppercase tracking-widest">
            {isLeague ? "League Statistics" : "Candidate Attempt Details"}
          </h2>
        </div>
      </div>

      <div
        className={clsx(
          "grid grid-cols-1 md:grid-cols-2 gap-6",
          isLeague ? "lg:grid-cols-4" : "lg:grid-cols-4",
        )}
      >
        <div className="flex gap-3 items-center">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full relative overflow-hidden bg-[#F2F4F7] flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt={userName}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="font-bold text-lg text-grey-500">
                  {userInitials}
                </span>
              )}
            </div>
            <RankMedal
              rank={position}
              className="absolute -bottom-1 -right-1 drop-shadow-md w-5 h-5 scale-125 z-20"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div>
              <span className="text-[10px] font-bold text-grey-500 uppercase">
                Profile
              </span>
              <div className="flex items-center gap-2">
                <p className="font-bold text-[#101828] truncate">{userName}</p>
                <span className="text-[7px] bg-gray-100 px-1 py-0.2 rounded border font-bold text-gray-600 uppercase tracking-widest">
                  {state || "N/A"}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">{candidateEmail}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-500 rounded italic tracking-tight">
                  {schoolName || ""}
                </span>
                <span className="text-[9px] text-gray-500">—</span>
                <span className="text-[8px] text-gray-500 rounded font-semibold uppercase tracking-tight">
                  {currentClass || ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {(hasScore || isAbsent) && (
          <div className="flex items-center gap-4">
            {faceCapture && !isLeague && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-grey-500 uppercase tracking-wider">
                  Face Capture
                </span>
                <a
                  href={faceCapture}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-zoom-in transition-transform hover:scale-105"
                >
                  <div className="w-16 h-16 rounded-full relative overflow-hidden bg-[#F2F4F7] border-2 border-white shadow-sm ring-1 ring-black/5">
                    <Image
                      src={faceCapture}
                      alt="Face Capture"
                      fill
                      className="object-cover"
                    />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 items-center">
          <div className="relative">
            <PositionIcon className="w-10 h-10" />
            {isLeague && rankChange !== undefined && rankChange !== 0 && (
              <div
                className={clsx(
                  "absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded flex items-center",
                  rankChange > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                {rankChange > 0 ? "▲" : "▼"} {Math.abs(rankChange)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-grey-500 uppercase">
              {isLeague ? "Overall Rank" : "Rank Position"}
            </span>
            <p className="font-bold text-[#101828] text-[14px]">
              {position > 0 ? `${getOrdinal(position)} Place` : "Not Ranked"}
              {!isLeague && percentile && (
                <span className="ml-1 text-[10px] text-gray-400 font-normal">
                  ({percentile}%ile)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <ExamScoreIcon className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-grey-500 mb-1">
              {isLeague ? "CUMULATIVE SCORE" : "EXAM SCORE"}
            </span>
            <span
              className={clsx(
                "text-[12px] font-bold",
                isAbsent ? "text-grey-500" : "tracking-wide",
              )}
            >
              {isAbsent ? "Absent" : (numericScore as number).toFixed(2)}
              {!isLeague && !isAbsent && "%"}
            </span>
          </div>
        </div>

        {isLeague ? (
          <>
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                <SortIcon className="w-5 h-5 text-[#3E4095]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-grey-500 uppercase">
                  Trend
                </span>
                <p
                  className={clsx(
                    "font-bold",
                    !rankChange || rankChange === 0
                      ? "text-[#101828]"
                      : rankChange > 0
                        ? "text-green-600"
                        : "text-red-600",
                  )}
                >
                  {!rankChange || rankChange === 0
                    ? "Stable"
                    : rankChange > 0
                      ? `Improved by ${rankChange}`
                      : `Dropped by ${Math.abs(rankChange)}`}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                <StartTimeIcon className="w-5 h-5 text-[#3E4095]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-grey-500 uppercase">
                  Status
                </span>
                <p className="font-bold text-[#101828]">Active in League</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                <SortIcon className="w-5 h-5 text-[#3E4095]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-grey-500 uppercase">
                  Time Used
                </span>
                <p className="font-bold text-[#101828] text-xs">
                  {timeUsed ? formatTime(Number(timeUsed)) : "--:--"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <StartTimeIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-grey-500 uppercase">
                  Started At
                </span>
                <p className="font-bold text-[#101828] text-xs">
                  {startTime ? formatDateTime(new Date(startTime)) : "--:--"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <EndTimeIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-grey-500 uppercase">
                  Submitted At
                </span>
                <p className="font-bold text-[#101828] text-xs">
                  {endTime ? formatDateTime(new Date(endTime)) : "--:--"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* INTEGRITY SECTION - Merged cleanly at the bottom of the card */}
      {!isLeague && (
        <div className="mt-2 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-grey-500 uppercase tracking-wider">
                Proctoring Status
              </span>
              <div className="flex items-center gap-3">
                <ProctoringStatusBadge
                  status={proctoringSummary?.status || null}
                />
                {proctoringSummary?.is_manually_reviewed && (
                  <span className="text-[8px] font-black uppercase tracking-tighter bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                    Manually Reviewed
                  </span>
                )}
              </div>
            </div>

            <div className="w-px h-8 bg-gray-100 hidden md:block"></div>

            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-grey-500 uppercase tracking-wider">
                Integrity Score
              </span>
              <p className="font-black text-[#101828] text-sm">
                {proctoringSummary
                  ? `${(proctoringSummary.integrity_score * 100).toFixed(0)}%`
                  : "N/A"}
              </p>
            </div>

            <div className="w-px h-8 bg-gray-100 hidden md:block"></div>

            <div className="flex flex-col gap-1 items-center">
              <span className="text-[10px] font-bold text-grey-500 uppercase tracking-wider">
                Violations
              </span>
              <p className="font-black text-[#101828] text-sm">
                {proctoringSummary
                  ? `${proctoringSummary.total_violations} Total / ${proctoringSummary.critical_violations} Critical`
                  : "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={onAuditToggle}
            className={clsx(
              "w-full md:w-auto px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2",
              auditOpen
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 active:scale-95",
            )}
          >
            {auditLoading ? (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <i
                className={clsx(
                  "fas",
                  auditOpen ? "fa-times" : "fa-shield-alt",
                )}
              ></i>
            )}
            <span>{auditOpen ? "Close Review" : "Review Session"}</span>
          </button>
        </div>
      )}
    </ResponsiveContainer>
  );
}

function QuestionsTable({ questions }: { questions: SubmissionItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = questions.filter(
    (q) =>
      (q.question?.text?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ) ||
      (q.selected_option?.toLowerCase() || "").includes(
        searchTerm.toLowerCase(),
      ),
  );

  return (
    <ResponsiveContainer className="flex gap-4 py-8 px-0 flex-col w-full font-sans bg-white border border-gray-100 rounded-4xl shadow-sm overflow-hidden">
      <div className="flex md:flex-row md:items-center justify-between px-8 gap-4 mb-2">
        <div className="relative group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3E4095] transition-colors text-xs"></i>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search questions or answers..."
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
      <CustomTable<SubmissionItem>
        data={filteredQuestions}
        minWidth="800px"
        emptyLabel="No Questions Found"
        columns={[
          {
            key: "sn",
            header: "S/N",
            render: (_, __, index) => (
              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">
                  {index + 1}
                </span>
              </div>
            ),
            align: "center",
          },
          {
            key: "question",
            header: "Question & Answers",
            align: "left",
            render: (question, row) => {
              if (!question)
                return (
                  <span className="text-gray-400 italic text-xs">
                    Question data missing
                  </span>
                );
              const options = [
                { optionKey: "option_a", option: question.option_a },
                { optionKey: "option_b", option: question.option_b },
                { optionKey: "option_c", option: question.option_c },
                { optionKey: "option_d", option: question.option_d },
              ];

              const isCorrect = row.selected_option === question.correct_answer;

              return (
                <div className="flex text-start flex-col justify-start items-start gap-3 py-2">
                  <div className="font-bold text-gray-800 text-sm leading-relaxed">
                    <MathRenderer content={question.text} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 w-full mt-1">
                    {options.map((val, index) => {
                      const optionLetter = val.optionKey
                        .split("_")[1]
                        .toUpperCase();
                      const isSelected = row.selected_option === optionLetter;
                      const isCorrectOption =
                        question.correct_answer === optionLetter;

                      return (
                        <div
                          key={`option-${index + 1}`}
                          className={clsx("option flex gap-2 items-center")}
                        >
                          <div
                            className={clsx(
                              "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                              isSelected
                                ? "border-[#3E4095] bg-[#3E4095]"
                                : "border-gray-200",
                            )}
                          >
                            {isSelected && (
                              <div className="w-1 h-1 rounded-full bg-white" />
                            )}
                          </div>
                          <label
                            className={clsx(
                              "text-[11px] transition-colors",
                              isCorrect &&
                                isCorrectOption &&
                                "text-[#039855] font-bold",
                              !isCorrect &&
                                isSelected &&
                                "text-[#D92D20] font-bold",
                              !isCorrect &&
                                isCorrectOption &&
                                "text-[#3E4095] font-bold",
                              !isSelected &&
                                !isCorrectOption &&
                                "text-gray-500",
                            )}
                          >
                            <MathRenderer content={val.option} inline />
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            },
          },
          {
            key: "selected_option",
            header: "Result",
            align: "center",
            render: (selected, row) => {
              const isCorrect = selected === row.question?.correct_answer;
              return (
                <div className="flex justify-center">
                  {questionPassedStatus(isCorrect)}
                </div>
              );
            },
          },
        ]}
      />
    </ResponsiveContainer>
  );
}

function questionPassedStatus(status: boolean) {
  switch (status) {
    case true:
      return (
        <span className="text-[10px] font-black px-3 py-1.5 rounded-full border border-[#039855]/30 bg-[#ECFDF3] text-[#039855] tracking-widest uppercase">
          Passed
        </span>
      );
    case false:
      return (
        <span className="text-[10px] font-black px-3 py-1.5 rounded-full border border-[#D92D20]/30 bg-[#FEF3F2] text-[#D92D20] tracking-widest uppercase">
          Failed
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-black px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-400 tracking-widest uppercase">
          N/A
        </span>
      );
  }
}

function ProctoringStatusBadge({ status }: { status: ProctoringStatus }) {
  switch (status) {
    case "clear":
      return (
        <span className="text-[10px] font-black px-2 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-600 tracking-widest uppercase">
          Clear
        </span>
      );
    case "suspicious":
      return (
        <span className="text-[10px] font-black px-2 py-1 rounded-full border border-amber-500/30 bg-amber-50 text-amber-600 tracking-widest uppercase">
          Suspicious
        </span>
      );
    case "flagged":
      return (
        <span className="text-[10px] font-black px-2 py-1 rounded-full border border-rose-500/30 bg-rose-50 text-rose-600 tracking-widest uppercase animate-pulse">
          Flagged
        </span>
      );
    default:
      return (
        <span className="text-[10px] font-black px-2 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-400 tracking-widest uppercase">
          N/A
        </span>
      );
  }
}

function IntegrityAuditTimeline({
  auditData,
  submissions,
  onUpdateStatus,
  isUpdating,
}: {
  auditData: IntegrityAuditResponse;
  submissions: SubmissionItem[];
  onUpdateStatus: (status: ProctoringStatus) => void;
  isUpdating: boolean;
}) {
  return (
    <ResponsiveContainer className="p-8 flex flex-col gap-8 bg-white border border-gray-100 rounded-4xl shadow-sm animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between border-b border-gray-50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
            <i className="fas fa-history text-lg"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101828] uppercase tracking-tight">
              Review Timeline
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Exam Activity in Chronological Order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase mr-2">
            Override Status:
          </span>
          <button
            disabled={isUpdating}
            onClick={() => onUpdateStatus("clear")}
            className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors border border-transparent hover:border-emerald-200"
            title="Mark as Clear"
          >
            <i className="fas fa-check-circle"></i>
          </button>
          <button
            disabled={isUpdating}
            onClick={() => onUpdateStatus("suspicious")}
            className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors border border-transparent hover:border-amber-200"
            title="Mark as Suspicious"
          >
            <i className="fas fa-exclamation-circle"></i>
          </button>
          <button
            disabled={isUpdating}
            onClick={() => onUpdateStatus("flagged")}
            className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors border border-transparent hover:border-rose-200"
            title="Flag Attempt"
          >
            <i className="fas fa-flag"></i>
          </button>
        </div>
      </div>

      <div className="relative pl-8 border-l-2 border-dashed border-gray-100 ml-4 flex flex-col gap-10">
        {auditData.timeline.map((entry, idx) => (
          <TimelineNode key={idx} entry={entry} submissions={submissions} />
        ))}
      </div>

      <div className="mt-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-[#3E4095]/10 rounded-lg flex items-center justify-center text-[#3E4095] border border-[#3E4095]/25 shrink-0">
            <i className="fas fa-info-circle text-sm"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#3E4095] uppercase tracking-wider mb-1">
              How to review this exam session
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Look through the snapshots and any flagged events below. If you
              see a &quot;Gap,&quot; it means we lost connection to the
              candidate&apos;s browser during the exam &mdash; this could be due
              to internet issues or deliberate interference such as leaving the
              portal. Once you&apos;ve reviewed everything, use the buttons
              above to record your final decision.
            </p>
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
}

function TimelineNode({
  entry,
  submissions,
}: {
  entry: TimelineEntry;
  submissions: SubmissionItem[];
}) {
  if (entry.type === "sequence_gap" || entry.type === "time_gap") {
    const isSequenceGap = entry.type === "sequence_gap";
    return (
      <div className="relative">
        <div className="absolute -left-10.25 top-0 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-sm ring-4 ring-rose-50 animate-pulse"></div>
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shrink-0">
            <i className="fas fa-ghost"></i>
          </div>
          <div>
            <p className="text-xs font-black text-rose-700 uppercase tracking-widest">
              {entry.message}
            </p>
            {isSequenceGap && "expected_sequence" in entry && (
              <p className="text-[10px] text-rose-600 font-medium">
                Expected Heartbeat #{entry.expected_sequence} was never
                received.
              </p>
            )}
            {!isSequenceGap && "actual_duration_seconds" in entry && (
              <p className="text-[10px] text-rose-600 font-medium">
                Time gap of {(entry.actual_duration_seconds / 60).toFixed(1)}{" "}
                min (expected ~{entry.expected_duration_seconds / 60} min)
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const hasViolations = entry.events.length > 0;
  const isCritical = entry.suspicion_score > 0.7;

  // Extract current question from metadata if available
  const currentQuestionId = entry.meta?.current_question_id;
  const activeQuestionIndex = currentQuestionId
    ? submissions.findIndex((s) => s.question.id === currentQuestionId)
    : -1;
  const activeQuestion =
    activeQuestionIndex !== -1
      ? submissions[activeQuestionIndex]?.question
      : null;
  const activeQuestionSn =
    activeQuestionIndex !== -1 ? activeQuestionIndex + 1 : null;

  return (
    <div className="relative">
      <div
        className={clsx(
          "absolute -left-10.25 top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ring-4",
          isCritical
            ? "bg-rose-500 ring-rose-50"
            : hasViolations
              ? "bg-amber-500 ring-amber-50"
              : "bg-emerald-500 ring-emerald-50",
        )}
      ></div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-1 rounded">
              Seq #{entry.sequence_number}
            </span>
            <span className="text-xs font-bold text-gray-800 tracking-tight">
              {formatDateTime(entry.timestamp)}
            </span>

            {activeQuestion && (
              <div
                className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-[#3E4095] rounded-lg border border-blue-100/50 ml-2"
                title={activeQuestion.text}
              >
                <i className="fas fa-question-circle text-[8px]"></i>
                <span className="text-[9px] font-black uppercase tracking-tighter">
                  Viewing Q#{activeQuestionSn}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Suspicion:
            </span>
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={clsx(
                  "h-full transition-all duration-1000",
                  entry.suspicion_score > 0.7
                    ? "bg-rose-500"
                    : entry.suspicion_score > 0.3
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${entry.suspicion_score * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {entry.face_capture_url ? (
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-linear-to-tr from-[#3E4095] to-[#01ACEA] rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <a
                href={entry.face_capture_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-md cursor-zoom-in"
              >
                <Image
                  src={entry.face_capture_url}
                  alt={`Snapshot ${entry.sequence_number}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </a>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-2xl border-2 border-gray-100 bg-gray-50 flex flex-col items-center justify-center shrink-0">
              <i className="fas fa-camera-slash text-gray-300 text-xl mb-2"></i>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center px-2">
                No Capture
              </span>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-3">
            {entry.events.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-500">
                <i className="fas fa-check-circle text-[10px]"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  No violations detected
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {entry.events.map((event, eIdx) => (
                  <ViolationEventCard
                    key={eIdx}
                    event={event}
                    submissions={submissions}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ViolationEventCard({
  event,
  submissions,
}: {
  event: ViolationEvent;
  submissions: SubmissionItem[];
}) {
  const questionId = event.metadata?.question_id as number | undefined;
  const question = questionId
    ? submissions.find((s) => s.question.id === questionId)?.question
    : null;

  return (
    <div className="bg-gray-50/50 border border-gray-100 p-3 rounded-xl flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <i
          className={clsx(
            "fas text-[10px]",
            event.type === "TAB_SWITCH"
              ? "fa-window-restore text-amber-500"
              : event.type === "SCREENSHOT"
                ? "fa-camera text-rose-500"
                : event.type === "FULLSCREEN_EXIT"
                  ? "fa-compress-arrows-alt text-rose-500"
                  : "fa-user-secret text-amber-500",
          )}
        ></i>
        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
          {event.type.replace("_", " ")}
        </span>
        <span className="text-[8px] text-gray-400 font-bold">
          {formatDateTime(event.timestamp)}
        </span>
      </div>

      {question && (
        <div className="mt-1 p-3 bg-white rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-1">
          <p className="text-[8px] font-bold text-[#3E4095] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <i className="fas fa-question-circle"></i>
            Active Question during violation
          </p>
          <div className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-relaxed">
            <MathRenderer content={question.text} inline />
          </div>
        </div>
      )}

      {event.metadata &&
        Object.keys(event.metadata).length > 0 &&
        !question && (
          <p className="text-[9px] text-gray-500 italic">
            {JSON.stringify(event.metadata)}
          </p>
        )}
    </div>
  );
}

import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useGetCompetitionCandidateDetail from '@/hooks/useGetCompetitionCandidateDetail'
import { formatDateTime } from '@/utils/formatFileSize'
import { getOrdinal } from '@/utils/generalUtils'
import { getUserInitials } from '@/utils/capitalizeWords'
import clsx from 'clsx'
import { AngleIcon, CandidateIcon, SortIcon, FilterIcon } from '../AdminIcons'
import { EndTimeIcon, PositionIcon, StartTimeIcon, ExamScoreIcon } from './LeaderBoardIcon'
import { useAuth } from '@/contexts/AuthProvider'
import { ReactNode, useState } from 'react'
import Image from 'next/image'
import MathRenderer from '@/components/Exam/MathRenderer'
import RankMedal from '../Competition/RankMedal'
import ProfileModal from '@/components/Modals/ProfileModal'

interface ViewCandidateDetailsProps {
    candidate_id: string;
    exam_id?: string;
    isLeagueCumulative?: boolean;
    stage?: string;
    round?: string;
    onBack?: () => void;
}

function ViewProfileButton({ role, id, onOpen }: { role: string; id: string; onOpen: () => void }): ReactNode {
    switch (role) {
        case 'volunteer':
        case 'moderator':
            return <></>;

        case 'admin':
        case 'manager':
        case 'superadmin':
             return (
                <button
                    onClick={onOpen}
                    className="inline-flex gap-2 border border-[#D0D5DD] px-4 cursor-pointer py-2 font-bold uppercase rounded-full transition-colors duration-200 items-center text-xs bg-white hover:bg-gray-50 outline-none"
                >
                    <span><CandidateIcon className="w-4 h-4" /></span>
                    <span>View Profile</span>
                </button>
             );

        default:
            return <></>;
    }
}

export default function ViewCandidateDetails({ candidate_id, exam_id, isLeagueCumulative, onBack }: ViewCandidateDetailsProps) {
    const { authState } = useAuth()
    const [profileOpen, setProfileOpen] = useState(false);

    const { data, isLoading } = useGetCompetitionCandidateDetail({
        candidate_id,
        exam_id,
        isLeagueCumulative
    });

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
        <div className='flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans'>
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-all active:scale-95 group"
                        >
                            <div className="rotate-180 group-hover:-translate-x-0.5 transition-transform"><AngleIcon width={8} height={14} /></div>
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-[#3E4095] rounded-full"></div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                                {isRanking ? 'Exam Performance' : 'League Performance'}
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {isRanking ? `${examDetails?.title || 'Performance Details'}` : 'Cumulative Performance'}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <ViewProfileButton
                        role={authState?.user?.role || ''}
                        id={candidate_id}
                        onOpen={() => setProfileOpen(true)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
                <CandidateInfoCard
                    endTime={performanceData?.submitted_at || performanceData?.recorded_at || performanceData?.participated_at}
                    startTime={performanceData?.started_at || examDetails?.scheduled_date}
                    position={performanceData?.rank || performanceData?.overall_rank || 0}
                    userName={candidateInfo?.full_name || performanceData?.candidate_name || performanceData?.candidate?.full_name || ''}
                    profilePicture={performanceData?.candidate?.profile_picture || null}
                    faceCapture={performanceData?.face_capture}
                    score={performanceData?.score || performanceData?.total_score}
                    isLeague={isLeagueCumulative}
                    rankChange={performanceData?.rank_change}
                    schoolName={candidateInfo?.school_name || performanceData?.school_name}
                    candidateEmail={candidateInfo?.email || performanceData?.candidate_email}
                    state={candidateInfo?.state}
                    percentile={performanceData?.percentile}
                    currentClass={candidateInfo?.current_class}
                />

                {isRanking && performanceData?.submissions && (
                    <QuestionsTable questions={performanceData.submissions} />
                )}

                {isLeagueCumulative && (
                   <ResponsiveContainer className="p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                            <PositionIcon className="w-8 h-8 text-[#3E4095]" />
                        </div>
                        <div className="max-w-md">
                            <h3 className="text-lg font-bold text-[#101828]">Cumulative League View</h3>
                            <p className="text-sm text-[#667185] mt-1">
                                You are viewing the cumulative performance of {performanceData?.candidate_name} across all published league rounds.
                                Detailed answer breakdowns are available in the specific round ranking.
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
    )
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
    currentClass
}: {
    userName: string,
    position: number,
    startTime?: string | Date,
    endTime?: string | Date,
    profilePicture: string | null,
    faceCapture?: string | null,
    score?: string | number,
    isLeague?: boolean,
    rankChange?: number,
    schoolName?: string,
    candidateEmail?: string,
    state?: string,
    percentile?: number,
    currentClass?: string
}) {
    const userInitials = getUserInitials(userName);
    const isAbsent = typeof score === 'string' && score.toLowerCase() === 'absent';
    const numericScore = isAbsent ? null : (typeof score === 'string' ? parseFloat(score) : score);
    const hasScore = numericScore !== undefined && numericScore !== null && !isNaN(numericScore as number);

    return <ResponsiveContainer className='flex gap-6 flex-col p-6'>
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <h2 className='font-bold text-sm text-[#475367] uppercase tracking-widest'>
                    {isLeague ? 'League Statistics' : 'Candidate Attempt Details'}
                </h2>
                {/* {!isLeague && (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-600 uppercase tracking-tighter">{state || 'N/A'}</span>
                        <span className="text-[9px] bg-blue-50 px-2 py-0.5 rounded font-bold text-[#3E4095] tracking-tight">{schoolName || ''}</span>
                        {currentClass && <span className="text-[9px] bg-emerald-50 px-2 py-0.5 rounded font-bold text-emerald-600 uppercase tracking-tight">{currentClass}</span>}
                    </div>
                )} */}
            </div>
            </div>

            <div className={clsx(
            "grid grid-cols-1 md:grid-cols-2 gap-6",
            isLeague ? "lg:grid-cols-4" : "lg:grid-cols-4"
            )}>
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
                            <span className="font-bold text-lg text-[#667185]">{userInitials}</span>
                        )}
                    </div>
                    <RankMedal rank={position} className="absolute -bottom-1 -right-1 drop-shadow-md w-5 h-5 scale-125 z-20" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div>
                        <span className='text-[10px] font-bold text-[#667185] uppercase'>Profile</span>
                        <div className='flex items-center gap-2'>
                            <p className="font-bold text-[#101828] truncate">{userName}</p>
                            <span className="text-[7px] bg-gray-100 px-1 py-0.2 rounded border font-bold text-gray-600 uppercase tracking-widest">{state || 'N/A'}</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{candidateEmail}</p>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-gray-500 rounded italic tracking-tight">{schoolName || ''}</span>
                            <span className="text-[9px] text-gray-500">—</span>
                            <span className="text-[8px] text-gray-500 rounded font-semibold uppercase tracking-tight">{currentClass || ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            {(hasScore || isAbsent) && (
                <div className="flex items-center gap-4">
                    {faceCapture && !isLeague && (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-[#667185] uppercase tracking-wider">Face Capture</span>
                            <a href={faceCapture} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in transition-transform hover:scale-105">
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
                        <div className={clsx(
                            "absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded flex items-center",
                            rankChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {rankChange > 0 ? '▲' : '▼'} {Math.abs(rankChange)}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className='text-[10px] font-bold text-[#667185] uppercase'>
                        {isLeague ? 'Overall Rank' : 'Rank Position'}
                    </span>
                    <p className="font-bold text-[#101828] text-[14px]">
                        {position > 0 ? `${getOrdinal(position)} Place` : 'Not Ranked'}
                        {!isLeague && percentile && (
                            <span className="ml-1 text-[10px] text-gray-400 font-normal">({percentile}%ile)</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 items-center">
                <ExamScoreIcon className="w-10 h-10"/>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#667185] mb-1">
                        {isLeague ? 'CUMULATIVE SCORE' : 'EXAM SCORE'}
                    </span>
                    <span className={clsx(
                        "text-[12px] font-bold",
                        isAbsent
                            ? "text-[#667185]"
                            : "tracking-wide"
                    )}>
                        {isAbsent ? 'Absent' : (numericScore as number).toFixed(2)}
                        {!isLeague && !isAbsent && '%'}
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
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Trend</span>
                            <p className={clsx(
                                "font-bold",
                                !rankChange || rankChange === 0 ? "text-[#101828]" : rankChange > 0 ? "text-green-600" : "text-red-600"
                            )}>
                                {!rankChange || rankChange === 0 ? 'Stable' : rankChange > 0 ? `Improved by ${rankChange}` : `Dropped by ${Math.abs(rankChange)}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-[#F9F9FB] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                            <StartTimeIcon className="w-5 h-5 text-[#3E4095]" />
                        </div>
                        <div className="flex flex-col">
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Status</span>
                            <p className="font-bold text-[#101828]">Active in League</p>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex gap-3 items-center">
                        <StartTimeIcon className="w-10 h-10" />
                        <div className="flex flex-col">
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Started At</span>
                            <p className="font-bold text-[#101828] text-xs">{startTime ? formatDateTime(new Date(startTime)) : '--:--'}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <EndTimeIcon className="w-10 h-10" />
                        <div className="flex flex-col">
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Submitted At</span>
                            <p className="font-bold text-[#101828] text-xs">{endTime ? formatDateTime(new Date(endTime)) : '--:--'}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    </ResponsiveContainer>
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuestionsTable({ questions }: { questions: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuestions = questions.filter(q =>
        (q.question?.text?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (q.selected_option?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return <ResponsiveContainer className='flex gap-4 py-8 px-0 flex-col w-full font-sans bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden'>
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
        <CustomTable
            data={filteredQuestions}
            minWidth="800px"
            emptyLabel="No Questions Found"
            columns={[
                {
                    key: "S/N",
                    header: "S/N",
                    render: (_, __, index) => (
                        <div className="flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                        </div>
                    ),
                    align: 'center'
                },
                {
                    key: 'question_text',
                    header: 'Question & Answers',
                    align: 'left',
                    render: (_, row) => {
                        const question = row.question;
                        if (!question) return <span className="text-gray-400 italic text-xs">Question data missing</span>;
                        const options = [
                            { optionKey: 'option_a', option: question.option_a },
                            { optionKey: 'option_b', option: question.option_b },
                            { optionKey: 'option_c', option: question.option_c },
                            { optionKey: 'option_d', option: question.option_d },
                        ];

                        const isCorrect = row.selected_option === question.correct_answer;

                        return <div className="flex text-start flex-col justify-start items-start gap-3 py-2">
                            <div className="font-bold text-gray-800 text-sm leading-relaxed">
                                <MathRenderer content={question.text} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 w-full mt-1">
                                {
                                    options.map((val, index) => {
                                        const optionLetter = val.optionKey.split('_')[1].toUpperCase();
                                        const isSelected = row.selected_option === optionLetter;
                                        const isCorrectOption = question.correct_answer === optionLetter;

                                        return <div key={`option-${index + 1}`} className={clsx("option flex gap-2 items-center")}>
                                            <div className={clsx(
                                                "w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                                isSelected ? "border-[#3E4095] bg-[#3E4095]" : "border-gray-200"
                                            )}>
                                                {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                            </div>
                                            <label className={clsx(
                                                'text-[11px] transition-colors',
                                                isCorrect && isCorrectOption && 'text-[#039855] font-bold',
                                                !isCorrect && isSelected && 'text-[#D92D20] font-bold',
                                                !isCorrect && isCorrectOption && 'text-[#3E4095] font-bold',
                                                !isSelected && !isCorrectOption && 'text-gray-500'
                                            )}>
                                                <MathRenderer content={val.option} inline />
                                            </label>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    }
                },
                {
                    key: 'is_correct',
                    header: 'Result',
                    align: 'center',
                    render: (_, row) => {
                        const isCorrect = row.selected_option === row.question?.correct_answer;
                        return <div className='flex justify-center'>
                            {questionPassedStatus(isCorrect)}
                        </div>
                    },
                },
            ]}
        />
    </ResponsiveContainer>
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
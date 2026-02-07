import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useGetCompetitionCandidateDetail from '@/hooks/useGetCompetitionCandidateDetail'
import { formatTimeToString } from '@/utils/formatFileSize'
import { getOrdinal } from '@/utils/generalUtils'
import { getUserInitials } from '@/utils/capitalizeWords'
import clsx from 'clsx'
import { AngleIcon, CandidateIcon, SortIcon } from '../AdminIcons'
import { EndTimeIcon, PositionIcon, StartTimeIcon } from './LeaderBoardIcon'
import { useAuth } from '@/contexts/AuthProvider'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MathRenderer from '@/components/Exam/MathRenderer'
import RankMedal from '../Competition/RankMedal'

interface ViewCandidateDetailsProps {
    candidate_id: string;
    exam_id?: string;
    isLeagueCumulative?: boolean;
    stage?: string;
    round?: string;
    onBack?: () => void;
}

function viewCandidateDetailsByType(role: string,id:string): ReactNode {
    switch (role) {
        case 'volunteer':
        case 'moderator':
            return <></>;

        case 'admin':
        case 'manager':
        case 'superadmin':
             return <Link href={`/admin/overview?tab=Registration&view=view-details&id=${id}`} className="inline-flex gap-2 border border-[#D0D5DD] px-4 cursor-pointer py-2 font-bold uppercase rounded-full transition-colors duration-200 items-center text-xs bg-white hover:bg-gray-50"><span><CandidateIcon className="w-4 h-4" /></span><span>View Profile</span></Link>;

        default:
            return <></>;
    }
}

export default function ViewCandidateDetails({ candidate_id, exam_id, isLeagueCumulative, stage, round, onBack }: ViewCandidateDetailsProps) {
    const { authState } = useAuth()
    const userButton = viewCandidateDetailsByType(authState!.user!.role!, candidate_id);
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

    return (
        <div className='flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans'>
            {/* Custom Header with Back Button */}
            <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button 
                            onClick={onBack}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                        >
                            <div className="rotate-180"><AngleIcon width={8} height={14} /></div>
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-[#101828]">
                            {isRanking ? 'Candidate Answers' : 'League Performance'}
                        </h1>
                        <p className="text-xs text-[#667185] uppercase font-semibold tracking-wider">
                            {isRanking ? `${examDetails?.title || stage} - Round ${examDetails?.round || round}` : 'Cumulative League Leaderboard'}
                        </p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    {userButton}
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
                <CandidateInfoCard 
                    endTime={performanceData?.recorded_at || performanceData?.participated_at} 
                    startTime={examDetails?.scheduled_date} 
                    position={performanceData?.rank || performanceData?.overall_rank || 0} 
                    userName={performanceData?.candidate_name || performanceData?.candidate?.full_name || ''}
                    profilePicture={performanceData?.candidate?.profile_picture || null}
                    score={performanceData?.score || performanceData?.total_score}
                    isLeague={isLeagueCumulative}
                    rankChange={performanceData?.rank_change}
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
        </div>
    )
}

function CandidateInfoCard({ 
    userName, 
    position, 
    startTime, 
    endTime, 
    profilePicture, 
    score, 
    isLeague,
    rankChange
}: { 
    userName: string, 
    position: number, 
    startTime?: string | Date, 
    endTime?: string | Date, 
    profilePicture: string | null, 
    score?: string | number,
    isLeague?: boolean,
    rankChange?: number
}) {
    const userInitials = getUserInitials(userName);
    const displayScore = typeof score === 'string' ? parseFloat(score) : score;

    return <ResponsiveContainer className='flex gap-6 flex-col p-6'>
        <div className="flex justify-between items-start">
            <h2 className='font-bold text-sm text-[#475367] uppercase tracking-widest'>
                {isLeague ? 'League Statistics' : 'Candidate Performance'}
            </h2>
            {displayScore !== undefined && (
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-[#667185] mb-1">
                        {isLeague ? 'CUMULATIVE SCORE' : 'FINAL SCORE'}
                    </span>
                    <span className="text-xl font-black text-[#3E4095] bg-[#EBEBF5] px-4 py-1 rounded-lg border border-[#3E4095]/10">
                        {displayScore.toFixed(2)}
                        {!isLeague && '%'}
                    </span>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex gap-3 items-center">
                <div className="relative shrink-0 w-12 h-12">
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
                    <RankMedal rank={position} className="absolute -bottom-1 -right-1 drop-shadow-md w-5 h-5 scale-125" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className='text-[10px] font-bold text-[#667185] uppercase'>Candidate</span>
                    <p className="font-bold text-[#101828] truncate">{userName}</p>
                </div>
            </div>

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
                    <p className="font-bold text-[#101828]">{position > 0 ? `${getOrdinal(position)} Place` : 'Not Ranked'}</p>
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
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Start Time</span>
                            <p className="font-bold text-[#101828]">{startTime ? formatTimeToString(new Date(startTime)) : '--:--'}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center">
                        <EndTimeIcon className="w-10 h-10" />
                        <div className="flex flex-col">
                            <span className='text-[10px] font-bold text-[#667185] uppercase'>Recorded At</span>
                            <p className="font-bold text-[#101828]">{endTime ? formatTimeToString(new Date(endTime)) : '--:--'}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    </ResponsiveContainer>
}

function QuestionsTable({ questions }: { questions: any[] }) {
    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-4 pt-2">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold text-[#101828]'>Response Detail</h2>
                <p className="text-xs text-[#667185]">Reviewing candidate answers against correct options</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <input type="text" placeholder='Search questions' className='border h-9 px-3 py-1 rounded-md border-[#E4E7EC] outline-none text-xs w-48 focus:border-[#3E4095] transition-colors' />
                </div>
                <button className='inline-flex items-center gap-2 border rounded-md h-9 px-3 py-1 border-[#E4E7EC] cursor-pointer hover:bg-gray-50 transition-colors'>
                    <SortIcon className="w-3 h-3" />
                    <span className='text-[#344054] text-xs font-medium'>Sort</span>
                </button>
            </div>
        </div>
        <CustomTable
            data={questions}
            minWidth="800px"
            columns={[
                {
                    key: "S/N", header: "S/N", render: (_, __, index) => {
                        return (
                            <div className="flex justify-center items-center font-medium text-gray-400">
                                <span>{index + 1}</span>
                            </div>
                        )
                    },
                    align: 'center'
                },
                {
                    key: 'question_text', header: 'Question & Answers', align: 'left', render: (_, row) => {
                        const question = row.question;
                        const options = [
                            { optionKey: 'option_a', option: question.option_a },
                            { optionKey: 'option_b', option: question.option_b },
                            { optionKey: 'option_c', option: question.option_c },
                            { optionKey: 'option_d', option: question.option_d },
                        ];
                        
                        const isCorrect = row.selected_option === question.correct_answer;
                        
                        return <div className="flex text-start flex-col justify-start items-start gap-3 py-1">
                            <div className="font-bold text-gray-900 text-sm leading-relaxed">
                                <MathRenderer content={question.text} />
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full mt-1"  >
                                {
                                    options.map((val, index) => {
                                        const optionLetter = val.optionKey.split('_')[1].toUpperCase();
                                        const isSelected = row.selected_option === optionLetter;
                                        const isCorrectOption = question.correct_answer === optionLetter;

                                        return <div key={`option-${index + 1}`} className={clsx("option flex gap-2 items-center")}>
                                            <div className={clsx(
                                                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                                                isSelected ? "border-[#3E4095] bg-[#3E4095]" : "border-gray-300"
                                            )}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <label className={clsx(
                                                'text-xs transition-colors',
                                                isCorrect && isCorrectOption && 'text-[#099137] font-bold', 
                                                !isCorrect && isSelected && 'text-[#CB1A14] font-bold', 
                                                !isCorrect && isCorrectOption && 'text-[#1c61d8] font-bold',
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
                    key: 'is_correct', header: 'Result', align: 'center', render: (_, row) => {
                        const isCorrect = row.selected_option === row.question.correct_answer;
                        return <div className='items-center'>
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
            return <span className={clsx('px-4 py-1.5 border border-[#099137]/30 bg-[#ECFDF3] rounded-full text-xs font-bold text-[#099137]')}>PASSED</span>;
        case false:
            return <span className={clsx('px-4 py-1.5 border border-[#D42620]/30 bg-[#FEF3F2] rounded-full text-xs font-bold text-[#D42620]')}>FAILED</span>;
        default:
            return <span className={clsx('px-4 py-1.5 border border-gray-300 bg-gray-50 rounded-full text-xs font-bold text-gray-500')}>NA</span>;
    }
}
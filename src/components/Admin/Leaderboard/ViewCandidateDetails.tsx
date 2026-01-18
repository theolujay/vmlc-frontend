import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useGetLeaderBoardCandidateDetail from '@/hooks/useGetLeaderBoardCandidateDetail'
import { SubmissionItem } from '@/types/LeaderBoardType'
import { formatTimeToString } from '@/utils/formatFileSize'
import { getOptionAsArray, getOrdinal } from '@/utils/generalUtils'
import clsx from 'clsx'
import AdminHeader from '../AdminHeader'
import { CandidateIcon, SortIcon } from '../AdminIcons'
import { CandidateNameIcon, EndTimeIcon, PositionIcon, StartTimeIcon } from './LeaderBoardIcon'
import { useAuth } from '@/contexts/AuthProvider'
import { ReactNode } from 'react'
import Link from 'next/link'
import MathRenderer from '@/components/Exam/MathRenderer'



function viewCandidateDetailsByType(role: string,id:string): ReactNode {
    switch (role) {
        case 'volunteer':
        case 'moderator':
            return <></>;

        case 'admin':
        case 'manager':
        case 'superadmin':
             return <Link href={`/admin/overview?tab=Overview&view=view-details&id=${id}`} className="inline-flex gap-2 border px-2   cursor-pointer py-2 font-bold uppercase rounded-[8px] transition-colors duration-200 items-center text-sm"><span><CandidateIcon /></span><span>View Candidate Profile</span></Link>;
            // return <button className="inline-flex gap-2 border px-2   cursor-pointer py-2 font-bold uppercase rounded-[8px] transition-colors duration-200 items-center text-sm"><span><CandidateIcon /></span><span>View Candidate Profile</span></button>;

        default:
            return <></>;
    }
}




export default function ViewCandidateDetails({ candidate_id, level, stage }: { candidate_id: string, level: string, stage: string }) {


       const { authState } = useAuth()
        // const userTabs = getTabsForRole(authState?.user?.role!)
        const userButton=viewCandidateDetailsByType(authState?.user?.role!,candidate_id);
    const { data } = useGetLeaderBoardCandidateDetail(stage, level, candidate_id);
    // kf
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport={false} label='Leaderboards' actionButton={
                userButton
                // <button className="inline-flex gap-2 border px-2   cursor-pointer py-2 font-bold uppercase rounded-[8px] transition-colors duration-200 items-center text-sm"><span><CandidateIcon /></span><span>View Candidate Profile</span></button>
                } />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <CandidateInfoCard endTime={data?.candidate_performance.participated_at as Date} startTime={data?.exam_details.scheduled_date as Date} position={data?.candidate_performance.rank ?? 0} userName={data?.candidate_performance.candidate.full_name ?? ''} />
                <QuestionsTable questions={data?.candidate_performance.candidate.submissions ?? []} />
            </div>
        </div>
    )
}



function CandidateInfoCard({ userName, position, startTime,endTime }: { userName: string, position: number, startTime: Date,endTime:Date }) {

    return <ResponsiveContainer className='flex gap-2 flex-col'>
        <h2 className='font-semibold text-lg'>Candidate Info</h2>
        <div className="flex justify-between">
            <div className="flex gap-2">
                <span><CandidateNameIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>NAME OF CANDIDATE</span>
                    <p>{userName}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><PositionIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>POSITION</span>
                    <p>{getOrdinal(position)}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><StartTimeIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>START TIME</span>
                    {/* <p>09:00:08 AM</p> */}
                    <p>{formatTimeToString(startTime)}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <span><EndTimeIcon /></span>
                <div className="flex flex-col">
                    <span className='text-sm text-[#667185]'>EXAM END TIME</span>
                    <p>{formatTimeToString(endTime)}</p>
                    {/* <p>09:00:08 AM</p> */}
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}




function QuestionsTable({ questions }: { questions: SubmissionItem[] }) {


    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Questions</h2>
                <p>All questions added to this session</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div className="flex">
                    <input type="text" placeholder='Search questions' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer'><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
            
            </div>
        </div>
        <CustomTable
            data={questions}
            columns={[
                {
                    key: "S/N", header: "S/N", render: (_, __, index) => {
                        return (
                            <div className="flex justify-center items-center gap-1">
                                <span>{index + 1}</span>
                            </div>
                        )
                    },
                },
                {
                    key: 'data.text', header: 'Question', render: (_, row) => {
                        const options = getOptionAsArray(row)
                        
                        return <div className="flex text-start flex-col justify-start items-start gap-1 min-w-[300px]">
                            <div className="font-medium text-gray-900">
                                <MathRenderer content={row.question_text} />
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 w-full mt-1"  >
                                {
                                    options.map((val, index) => <div key={`option-${index + 1}`} className={clsx("option flex gap-2 items-center")}>
                                        <input id={val.optionKey} type="radio" disabled checked={val.optionKey.endsWith(row.selected_option.toLowerCase())} className="w-3 h-3 text-[#3E4095]" />
                                        <label className={clsx(
                                            'text-xs',
                                            row.is_correct && val.optionKey.endsWith(row.correct_answer.toLowerCase()) && 'text-[#099137] font-bold', 
                                            !row.is_correct && val.optionKey.endsWith(row.selected_option.toLowerCase()) && 'text-[#CB1A14] font-bold', 
                                            !row.is_correct && val.optionKey.endsWith(row.correct_answer.toLowerCase()) && 'text-[#1c61d8] font-bold'
                                        )} htmlFor={val.optionKey}>
                                            <MathRenderer content={val.option} inline />
                                        </label>
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                },
               
                {
                    key: 'Performance', header: 'Performance', render: (_, row) => <div className='flex items-center'>
                        {questionPassedStatus(row.is_correct)}

                    </div>
                },
               
            ]}
        //   footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />}
        />

    </ResponsiveContainer>
}

function questionPassedStatus(status: boolean) {
    switch (status) {
        case true:
            return <span className={clsx('px-3 capitalize border-2 rounded-full text-sm font-bold py-2 border-[#099137] text-[#099137]')}>Passed</span>;
        case false:
            return <span className={clsx('px-3 capitalize border-2 rounded-full text-sm font-bold py-2 border-[#D42620] text-[#D42620]')}>Failed</span>;
        default:
            return <span className={clsx('px-3 capitalize border rounded-full text-sm font-bold py-2 border-gray-400 text-gray-400')}>Indeterminate</span>;

    }
}




"use client"
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Spinner from '@/components/ui/spinner/spinner'
import useGetExamPortal from '@/hooks/useGetExamPortal'
import { ActiveExamType } from '@/types/Examtype'
import { formatDate } from '@/utils/formatFileSize'
import { formatEndTimeToStringForCandidate, formatTimeToStringForCandidate } from '@/utils/formatTime'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import { ExamCardGoTo } from '../GeneralIcon'
import { formatExamTitle } from '@/utils/generalUtils'

export default function ExamBoard() {
    const { data, isPending } = useGetExamPortal()

    let examList: ActiveExamType[] = [];
    if (data?.active_exam) {
        // Convert ActiveExamType to AvailableExamType
        examList = [{
            id: data.active_exam.id,
            title: data.active_exam.title,
            stage: data.active_exam.stage,
            round: data.active_exam.round,
            question_count: data.active_exam.question_count,
            starts_at: new Date(data.active_exam.starts_at),
            ends_at: new Date(data.active_exam.ends_at),
            duration_minutes: data.active_exam.duration_minutes,
            status: data.active_exam.status,
            has_participated: data.active_exam.has_participated,
            is_eligible: data.active_exam.is_eligible,
            access_status: data.active_exam.access_status
        }];
    }

    const examType = data?.candidate_context?.role || '';


    
    let content;

  if (isPending) {
    content = (
      <div className="flex w-full col-span-4 place-content-center">
        <Spinner />
      </div>
    );
  } else if (Array.isArray(examList) && examList.length > 0) {
    content = examList.map((val, index) => (
      <ExamCard key={`exam-index-${index}`} details={val} />
    ));
  } else {
    content = (
      <div className="flex place-content-center w-full col-span-4">
        There are no exams yet
      </div>
    );
  }
    
    return (
        <ResponsiveContainer className='gap-2'>
            <h2 className='font-bold text-xl'><span className='capitalize'>
                {examType}
            </span> Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-h-[40vh]">

                {/* {isPending ? <div className='w-full place-content-center'><Spinner /></div> :
                    Array.isArray(examList) && examList.length > 0 ?
                        examList.map((val, index) => <ExamCard key={`exam-index-${index}`} details={val} />) : <div className='flex place-content-center w-full col-span-4'>There are no exams yet</div>
                } */}
{content}

            </div>
        </ResponsiveContainer>
    )
}


function ExamCard({ details }: { details: ActiveExamType }) {

    const [examNotWritten] = useState(true)
    return <Link href={`/exam-portal/${details.id}/exam`} className='flex relative mt-8 justify-center flex-col'>
        <div className={clsx('pt-2 pb-7 p-2 absolute w-full -top-8   text-white rounded-t-2xl', examNotWritten && 'bg-[#00455E]')}>
            <div className="flex justify-between">
                {/* <span className='text-sm'>12 Days to exam</span> */}
                <span className='font-bold text-sm'> {details.starts_at ? formatDate(details.starts_at) : 'DD:MM:YYYY'}</span>
            </div>
        </div>
        <div className="flex flex-col z-10 bg-[#F0F2F5] rounded-2xl p-2">
            <div className="flex  flex-col gap-1 rounded-lg">
                <span className='text-[0.875rem] uppercase'>{formatExamTitle(details.title)}</span>
                <div className="flex bg-[#F9FAFB] text-sm p-2 rounded-lg flex-col">
                    <div className={clsx('flex  justify-between ', examNotWritten && 'text-[#04802E]')}>
                        <span>START TIME</span>
                        <span>{formatTimeToStringForCandidate(details.starts_at)}</span>
                    </div>
                    <div className={clsx('flex justify-between', examNotWritten && 'text-[#CB1A14]')}>
                        <span>END TIME</span>
                        <span>{formatEndTimeToStringForCandidate(details.starts_at, details.duration_minutes)}</span>
                        {/* <span>09:00am</span> */}
                    </div>
                </div>
                <p className='font-bold text-[2.5rem] '>{details.question_count}</p>
                <div className='flex justify-between items-center'>
                    <span className='text-sm'>questions set in this session</span>
                    <span><ExamCardGoTo /></span>
                </div>
            </div>
        </div>
    </Link>
}
"use client"
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import React, { useState } from 'react'
import { ExamCardGoTo } from '../GeneralIcon'
import clsx from 'clsx'
import Link from 'next/link'
import { AvailableExamType } from '@/types/Examtype'
import { formatDate, formatTimeToString } from '@/utils/formatFileSize'
import { formatEndTimeToStringForCandidate, formatTime, formatTimeToStringForCandidate } from '@/utils/formatTime'

export default function ExamBoard({ examType, examList }: { examType?: string, examList?: AvailableExamType[] }) {
    return (
        <ResponsiveContainer className='gap-2'>
            <h2 className='font-bold text-xl'><span className='capitalize'>
                {examType}
            </span> Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* {
                    Array.from({ length: 2 }).map((_, index) => <ExamCard key={`exam-index-${index}`} />)
                } */}
                {
                    Array.isArray(examList) && examList.length > 0 ?
                        examList.map((val, index) => <ExamCard key={`exam-index-${index}`} details={val} />) : <div className='flex place-content-center w-full col-span-4'>There are no exams yet</div>
                }


            </div>
        </ResponsiveContainer>
    )
}


function ExamCard({ details }: { details: any }) {
    console.log(details, 'what is in exam details')
    const [examNotWritten] = useState(true)
    return <Link href='/exam-portal/exam' className='flex relative mt-8 justify-center flex-col'>
        <div className={clsx('pt-2 pb-7 p-2 absolute w-full -top-8   text-white rounded-t-2xl', examNotWritten && 'bg-[#00455E]')}>
            <div className="flex justify-between">
                {/* <span className='text-sm'>12 Days to exam</span> */}
                <span className='font-bold text-sm'> {details.scheduled_date ? formatDate(details.scheduled_date) : 'DD:MM:YYYY'}</span>
            </div>
        </div>
        <div className="flex flex-col z-10 bg-[#F0F2F5] rounded-2xl p-2">
            <div className="flex  flex-col gap-1 rounded-lg">
                <span className='text-[0.875rem] uppercase'>{details.title}</span>
                <div className="flex bg-[#F9FAFB] text-sm p-2 rounded-lg flex-col">
                    <div className={clsx('flex  justify-between ', examNotWritten && 'text-[#04802E]')}>
                        <span>START TIME</span>
                        <span>{formatTimeToStringForCandidate(details.scheduled_date)}</span>
                    </div>
                    <div className={clsx('flex justify-between', examNotWritten && 'text-[#CB1A14]')}>
                        <span>END TIME</span>
                        <span>{formatEndTimeToStringForCandidate(details.scheduled_date, details.countdown_minutes)}</span>
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
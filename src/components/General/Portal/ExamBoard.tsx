"use client"
import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React, { useState } from 'react'
import { ExamCardGoTo } from '../GeneralIcon'
import clsx from 'clsx'
import Link from 'next/link'

export default function ExamBoard() {
    return (
        <ResponsiveContainer className='gap-2'>
            <h2 className='font-bold text-xl'>League Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {
                    Array.from({ length: 6 }).map((_, index) => <ExamCard key={`exam-index-${index}`} />)
                }


            </div>
        </ResponsiveContainer>
    )
}


function ExamCard() {
    const [examNotWritten] = useState(true)
    return <Link href='/' className='flex relative mt-8 justify-center flex-col'>
        <div className={clsx('pt-2 pb-7 p-2 absolute w-full -top-8   text-white rounded-t-2xl', examNotWritten && 'bg-[#00455E]')}>
            <div className="flex justify-between">
                <span className='text-sm'>12 Days to exam</span>
                <span className='font-bold text-sm'>21 - 09 - 2025</span>
            </div>
        </div>
        <div className="flex flex-col z-10 bg-[#F0F2F5] rounded-2xl p-2">
            <div className="flex  flex-col gap-1 rounded-lg">
                <span className='text-[0.875rem]'>SCREENING EXAM</span>
                <div className="flex bg-[#F9FAFB] text-sm p-2 rounded-lg flex-col">
                    <div className={clsx('flex  justify-between ', examNotWritten && 'text-[#04802E]')}>
                        <span>START TIME</span>
                        <span>09:00am</span>
                    </div>
                    <div className={clsx('flex justify-between', examNotWritten && 'text-[#CB1A14]')}>
                        <span>END TIME</span>
                        <span>09:00am</span>
                    </div>
                </div>
                <p className='font-bold text-[2.5rem] '>30</p>
                <div className='flex justify-between items-center'>
                    <span className='text-sm'>questions set in this session</span>
                    <span><ExamCardGoTo /></span>
                </div>
            </div>
        </div>
    </Link>
}
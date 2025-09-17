import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { ExamCardGoTo } from '../GeneralIcon'

export default function ExamBoard() {
    return (
        <ResponsiveContainer className='gap-2'>
            <h2 className='font-bold text-xl '>League Exams</h2>
            <div className="grid grid-cols-4 gap-3">

            <ExamCard/>
            <ExamCard/>
            <ExamCard/>
            <ExamCard/>
            <ExamCard/>
            </div>
        </ResponsiveContainer>
    )
}


function ExamCard() {
    return <div className="flex flex-col bg-[#F0F2F5] rounded-2xl p-2">
        <div className="flex  flex-col gap-1 rounded-lg">
            <span className='text-[0.875rem]'>SCREENING EXAM</span>
            <div className="flex bg-[#F9FAFB] text-sm p-2 rounded-lg flex-col">
                <div className='flex  justify-between'>
                    <span>START TIME</span>
                    <span>09:00am</span>
                </div>
                <div className='flex justify-between'>
                    <span>END TIME</span>
                    <span>09:00am</span>
                </div>
            </div>
          <p className='font-bold text-[2.5rem] '>30</p>
          <div className='flex justify-between items-center'><span className='text-sm'>
            questions set in this session</span><span><ExamCardGoTo/></span></div>
        </div>

    </div>
}
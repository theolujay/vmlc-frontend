"use client"
import React, { useState } from 'react'
import AdminHeader from './AdminHeader'
import Button from '../ui/Button'
import ResponsiveContainer from '../ui/ResponsiveContainer'
import { ExamCardGoTo, TableIcon } from '../General/GeneralIcon'
import clsx from 'clsx'
import { SummaryIcon } from './AdminIcons'
import { GotoIcon } from '../General/GettingStarted/GettingStartedAssets'
import CreateExamSessionModal from './CreateExamSessionModal'
import Link from 'next/link'

export default function ExamSection() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button onClick={() => setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm">CREATE EXAM SESSION</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSession sessions={[]} />
        <ExamSummary />
      </div>
      <CreateExamSessionModal open={open} close={setOpen} />
    </div>
  )
}


function ExamSummary() {
  return <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-4 gap-3'>
    <SummaryCard label='TOTAL QUESTION POOL' value={0} className='bg-[#E6F7FD] p-3' textColor='text-[#018ABB]' />
    <SummaryCard label='EASY QUESTION LEVEL' value={0} className='bg-[#E7F6EC] p-3' textColor='text-[#099137]' />
    <SummaryCard label='MODERATE QUESTION LEVEL' value={0} className='bg-[#FEF6E7] p-3' textColor='text-[#AD6F07]' />
    <SummaryCard label='HARD QUESTION LEVEL' value={0} className='bg-[#FBEAE9] p-3' textColor='text-[#CB1A14]' />

  </ResponsiveContainer>
}


function SummaryCard({ label, className, textColor = 'text-black', value }: Readonly<{ className?: string, textColor?: string, value: number, label: string }>) {
  return <div className={clsx("flex flex-col p-4 gap-2 rounded-[10px]", className)}>
    <div className="flex flex-col gap-1">
      <span><SummaryIcon /></span>
      <span className={clsx(textColor, 'text-sm font-bold ')}>{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className='text-2xl font-bold'>{value}</span>
      <span className={clsx('text-sm font-bold', textColor)}><GotoIcon /></span>
    </div>
  </div>
}

function QuestionSession({ sessions }: Readonly<{ sessions: string[] }>) {
  return <ResponsiveContainer className='gap-3'>
    {
      sessions.length == 0 && <div className='w-full grid place-content-center min-h-[50vh]'>
        <div className="flex items-center gap-2 flex-col">
          <span><TableIcon /></span>
          <h2 className='text-xl'>No question session has been created yet</h2>
          <p className='text-balance text-center text-sm text-[#667185]'>Question session set on the platform would appear here </p>
        </div>
      </div>
    }


    {sessions.length > 0 &&
      <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
        {Array.from({ length: 10 }).map((_, index) => <ExamSession key={index} />)}


      </div>
    }


  </ResponsiveContainer>
}





function ExamSession() {
  const [isActive] = useState(true)
  return <Link href='/' className='flex relative mt-8 justify-center flex-col'>
    <div className={clsx('pt-2 pb-7 p-2 absolute w-full -top-8   text-white rounded-t-2xl', isActive ? 'bg-[#00455E]' : 'bg-[#667185]')}>
      <div className="flex justify-between">
        <span className='text-sm'>12 Days to exam</span>
        <span className='font-bold text-sm'>21 - 09 - 2025</span>
      </div>
    </div>
    <div className={clsx("flex flex-col z-10  rounded-2xl p-2", isActive ? 'bg-[#E6F7FD]' : 'bg-[#F0F2F5]')}>
      <div className={clsx("flex  flex-col gap-1 rounded-lg")}>
        <span className='text-[0.875rem]'>SCREENING EXAM</span>

        <p className='font-bold text-[2.5rem] '>0</p>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>questions set in this session</span>
          <span><ExamCardGoTo /></span>
        </div>
      </div>
    </div>
  </Link>
}
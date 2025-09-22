import React from 'react'
import AdminHeader from './AdminHeader'
import Button from '../ui/Button'
import ResponsiveContainer from '../ui/ResponsiveContainer'
import { TableIcon } from '../General/GeneralIcon'
import clsx from 'clsx'
import { SummaryIcon } from './AdminIcons'
import { GotoIcon } from '../General/GettingStarted/GettingStartedAssets'

export default function ExamSection() {
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm">CREATE EXAM SESSION</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSession sessions={[]} />
        <ExamSummary />
      </div>
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
      sessions.length == 0&& <div className='w-full grid place-content-center min-h-[50vh]'>
        <div className="flex items-center gap-2 flex-col">
          <span><TableIcon /></span>
          <h2 className='text-xl'>No question session has been created yet</h2>
          <p className='text-balance text-center text-sm text-[#667185]'>Question session set on the platform would appear here </p>
        </div>
      </div> 


    }
    {      sessions.map((session, index) => <ExamSession session={session} key={`exam-session-${index}`} />)}
  </ResponsiveContainer>
}



function ExamSession({session}:Readonly<{session:string}>) {
  return <div className="flex">{session}</div>
}
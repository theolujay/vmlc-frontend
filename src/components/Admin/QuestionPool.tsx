"use client"
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { AddIcon, GotoIcon } from '../General/GettingStarted/GettingStartedAssets'
import Button from '../ui/Button'
import ResponsiveContainer from '../ui/ResponsiveContainer'
import AdminHeader from './AdminHeader'
import { FilterIcon, SortIcon, SummaryIcon } from './AdminIcons'
import EmptySession from './EmptySession'
import Table from '../ui/Table'
import { useState } from 'react'

export default function QuestionPool() {
  const [questions] = useState<string[]>([])
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD QUESTION</span></Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSummaryCard />
        {questions.length == 0 ? <EmptyState /> : <QuestionsTable />}

      </div>
    </div>
  )
}


function QuestionSummaryCard() {
  const currentView = useSearchParams().get('view');
  return <ResponsiveContainer className='grid gap-3 grid-cols-1 md:grid-cols-4 p-4'>
    <SummaryCard isActive={currentView == 'total-question'} label='TOTAL QUESTION POOL' value={0} textColor='text-[#018ABB]' />
    <SummaryCard isActive={currentView == 'easy-question'} label='EASY QUESTION LEVEL' value={0} textColor='text-[#099137]' />
    <SummaryCard isActive={currentView == 'moderate-question'} label='MODERATE QUESTION LEVEL' value={0} textColor='text-[#AD6F07]' />
    <SummaryCard isActive={currentView == 'hard-question'} label='HARD QUESTION LEVEL' value={0} textColor='text-[#CB1A14]' />
  </ResponsiveContainer>
}



function SummaryCard({ label, value, isActive = false }: Readonly<{ textColor?: string, value: number, label: string, isActive?: boolean }>) {
  return <div className={clsx("flex flex-col p-4 gap-2 rounded-[10px] ", isActive ? 'bg-[#3E4095] text-white' : 'bg-[#F7F9FC] text-[#344054]')}>
    <div className="flex gap-2">
      <span><SummaryIcon /></span>
      <span className={clsx('text-sm  ')}>{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className={clsx('text-2xl font-bold', isActive ? 'text-white' : 'text-black')}>{value}</span>
      <span className={clsx('text-sm font-bold',)}><GotoIcon /></span>
    </div>
  </div>
}



function EmptyState() {
  return <ResponsiveContainer className='gap-3'>
    <EmptySession label='No question has been created yet' desc='Question set on the platform would appear here ' />


  </ResponsiveContainer>
}



// function QuestionsTable(){
//   const columns=['S/N','Question','Difficulty','Date Added','Action']
//   return <div className="flex flex-col">

//     <Table data={[]} columns={columns}/>
//   </div>
// }

function QuestionsTable() {
  const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
  return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
    <div className="flex justify-between px-3">
      <div className="flex gap-1 flex-col">
        <h2 className='font-bold'>Questions</h2>
        <p>Questions added to the platform</p>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex">
          <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
        </div>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
      </div>
    </div>
    <Table data={[]} columns={columns} />
  </ResponsiveContainer>
}
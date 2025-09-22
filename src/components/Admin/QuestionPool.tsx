import React from 'react'
import AdminLayout from './AdminLayout'
import ResponsiveContainer from '../ui/ResponsiveContainer'
import { SummaryIcon } from './AdminIcons'
import clsx from 'clsx'
import { GotoIcon } from '../General/GettingStarted/GettingStartedAssets'
import EmptySession from './EmptySession'

export default function QuestionPool() {
  return (
   <AdminLayout>
   <QuestionSummaryCard/>
   <QuestionTable/>
   </AdminLayout>
  )
}


function QuestionSummaryCard(){
    return  <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-4 p-4'>
        <SummaryCard isActive label='TOTAL QUESTION POOL' value={0}  textColor='text-[#018ABB]' />
        <SummaryCard label='EASY QUESTION LEVEL' value={0}  textColor='text-[#099137]' />
        <SummaryCard label='MODERATE QUESTION LEVEL' value={0} textColor='text-[#AD6F07]' />
        <SummaryCard label='HARD QUESTION LEVEL' value={0}  textColor='text-[#CB1A14]' />
    </ResponsiveContainer>
}



function SummaryCard({ label, textColor = 'text-black', value,isActive=false }: Readonly<{ textColor?: string, value: number, label: string,isActive?:boolean }>) {
  return <div className={clsx("flex flex-col p-4 gap-2 rounded-[10px]", isActive?'bg-[#3E4095]':'bg-[#F7F9FC]')}>
    <div className="flex gap-2">
      <span><SummaryIcon /></span>
      <span className={clsx(textColor, 'text-sm font-bold ')}>{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className='text-2xl font-bold'>{value}</span>
      <span className={clsx('text-sm font-bold', textColor)}><GotoIcon /></span>
    </div>
  </div>
}


function QuestionTable(){
    return <EmptySession/>
}
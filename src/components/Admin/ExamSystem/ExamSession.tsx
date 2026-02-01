"use client";
import Spinner from '@/components/ui/spinner/spinner'
import usePagination from '@/hooks/usePagination'
import useViewExamQuestions from '@/hooks/useViewExamQuestions'
import { SessionQuestionItemType } from '@/types/Examtype'
import { formatExamTitle } from '@/utils/generalUtils'
import { formatDate } from '@/utils/formatFileSize'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import QuestionsTable from '../QuestionsTable'
import ExamSessionDropdownDialog from './ExamSessionDropdownDialog'
import { SummaryIcon } from '../AdminIcons';
import { GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';






export default function ExamSession() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const { page, setPage } = usePagination()
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isPending } = useViewExamQuestions(id, page, filters)


  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={[
        <ExamSessionDropdownDialog exam_id={id} data={data} key='actions' />
      ]} />
      {isPending ? <div className='w-full h-full grid place-content-center'>
        <Spinner />
      </div> :
        <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
          <SessionDetails dateCreated={data?.created_at ?? new Date()} title={formatExamTitle(data?.title)} description={data?.description} />
          <QuestionSummaryCard moderate_question={data?.questions?.question_pool_data?.moderate_questions_count ?? 0} hard_question={data?.questions?.question_pool_data?.hard_questions_count ?? 0} easy_question={data?.questions?.question_pool_data?.easy_questions_count ?? 0} total={data?.questions?.question_pool_data?.total_questions ?? 0} />
          <QuestionsTable 
            page_count={data?.questions?.total_pages ?? 0} 
            currentPage={page} 
            onPageChange={setPage} 
            questions={(data?.questions?.results ?? []) as SessionQuestionItemType[]} 
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      }
    </div>
  )
}


function SessionDetails({ title, description, dateCreated }: Readonly<{ title?: string, description?: string, dateCreated: Date | string }>) {
  return <ResponsiveContainer className='gap-10 p-4 flex flex-col'>
    <div className="flex justify-between">
      <div className='flex flex-col gap-1'>
        <p className='text-sm'>EXAM TITLE</p>
        <h2 className='font-bold text-2xl'>{title}</h2>
      </div>
      <div className="flex flex-col gap-1">
        <span className='text-sm'>DATE CREATED</span>
      
        <span>{formatDate(dateCreated)}</span>
      </div>
    </div>
    <div className="flex flex-col">
      <p className='text-sm'>DESCRIPTION</p>
      <p>{description}</p>
    </div>

  </ResponsiveContainer>
}


function QuestionSummaryCard({ total = 0, easy_question = 0, moderate_question = 0, hard_question = 0 }: Readonly<{ total: number, easy_question: number, moderate_question: number, hard_question: number }>) {
  const currentView = useSearchParams().get('view');
  return <ResponsiveContainer className='grid gap-3 grid-cols-1 md:grid-cols-4 p-4'>
    <SummaryCard isActive={currentView == 'total-question'} label='TOTAL QUESTION POOL' value={total} textColor='text-[#018ABB]' />
    <SummaryCard isActive={currentView == 'easy-question'} label='EASY QUESTION LEVEL' value={easy_question} textColor='text-[#099137]' />
    <SummaryCard isActive={currentView == 'moderate-question'} label='MODERATE QUESTION LEVEL' value={moderate_question} textColor='text-[#AD6F07]' />
    <SummaryCard isActive={currentView == 'hard-question'} label='HARD QUESTION LEVEL' value={hard_question} textColor='text-[#CB1A14]' />
  </ResponsiveContainer>
}


function SummaryCard({ label, value, isActive = false }: Readonly<{ textColor?: string, value: number, label: string, isActive?: boolean }>) {
  return <div className={clsx("flex flex-col p-4 gap-2 rounded-[10px] ", isActive ? 'bg-[#018ABB] text-white' : 'bg-[#F0F2F5] text-[#344054]')}>
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




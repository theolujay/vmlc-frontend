"use client"
import useListQuestions from '@/hooks/useListQuestions'
import usePagination from '@/hooks/usePagination'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { AddIcon } from '../../General/GettingStarted/GettingStartedAssets'
import Button from '../../ui/Button'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import EmptySession from '../EmptySession'
import QuestionPoolTable from './QuestionPoolTable'
import SummaryCard from './SummaryCard'

const AddQuestionModal = dynamic(() => import('../../Modals/AddQuestionModal'), {
  ssr: false,
});


export default function QuestionPool() {

  const { page, setPage } = usePagination()
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    difficulty: 'total',
    search: ''
  })



  const searchParams = useSearchParams();
  useEffect(() => {
    const currentView = searchParams.get('view')
    setFilters((prev) => ({ ...prev, difficulty: currentView?.replace('-question', '') || 'easy' }))
  }, [searchParams])


  // const memoizedFilters = useMemo(() => {
  //   if (filters.difficulty == 'total') {
  //     return {};
  //   }
  //   return filters;
  // }, [filters])

  const memoizedFilters = useMemo(() => {
  const { difficulty, search } = filters;

  const cleaned: Record<string, string> = {};

  // Include search ALWAYS if not empty
  if (search.trim() !== '') {
    cleaned.search = search.trim();
  }

  // Include difficulty ONLY if not "total"
  if (difficulty !== 'total') {
    cleaned.difficulty = difficulty;
  }

  return cleaned;
}, [filters]);


  console.log(memoizedFilters, 'memoized filters in question pool')
  const { data ,isPending} = useListQuestions(page, memoizedFilters)
  // const { data ,isPending} = useListQuestions(page, filters)
  

  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button onClick={() => setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD QUESTION</span></Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSummaryCard easy_questions={data?.question_pool_data.easy_questions_count??0} total_questions={data?.question_pool_data.total_questions??0} moderate_questions={data?.question_pool_data.moderate_questions_count??0} hard_questions={data?.question_pool_data.hard_questions_count??0} />

        <QuestionPoolTable handleSearch={setFilters} page_count={data?.pagination.total_pages??0} currentPage={page} onPageChange={setPage} questions={data?.results ?? []} />



      </div>
      <AddQuestionModal open={open} close={setOpen} />
      {/* <QuestionInformation open={openDrawer} setOpen={setOpenDrawer} question='What is colonoscopy' difficulty='easy' /> */}
      {/* <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} /> */}
    </div>
  )
}


function QuestionSummaryCard({ total_questions = 0, easy_questions = 0, moderate_questions = 0, hard_questions = 0 }: Readonly<{ total_questions: number, easy_questions: number, moderate_questions: number, hard_questions: number }>) {
  const currentView = useSearchParams().get('view');
  return <ResponsiveContainer className='grid gap-3 grid-cols-1 md:grid-cols-4 p-4'>
    <SummaryCard isActive={currentView == 'total-question'} label='TOTAL QUESTION POOL' value={total_questions} textColor='text-[#018ABB]' />
    <SummaryCard isActive={currentView == 'easy-question'} label='EASY QUESTION LEVEL' value={easy_questions} textColor='text-[#099137]' />
    <SummaryCard isActive={currentView == 'moderate-question'} label='MODERATE QUESTION LEVEL' value={moderate_questions} textColor='text-[#AD6F07]' />
    <SummaryCard isActive={currentView == 'hard-question'} label='HARD QUESTION LEVEL' value={hard_questions} textColor='text-[#CB1A14]' />
  </ResponsiveContainer>
}






function EmptyState() {
  return <ResponsiveContainer className='gap-3'>
    <EmptySession label='No question has been created yet' desc='Question set on the platform would appear here ' />


  </ResponsiveContainer>
}




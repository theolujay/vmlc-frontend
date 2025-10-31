"use client"
import useListQuestions from '@/hooks/useListQuestions'
import usePagination from '@/hooks/usePagination'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { AddIcon } from '../../General/GettingStarted/GettingStartedAssets'
import AddQuestionModal from '../../Modals/AddQuestionModal'
import Button from '../../ui/Button'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import EmptySession from '../EmptySession'
import QuestionsTable from '../QuestionsTable'
import SummaryCard from './SummaryCard'
import QuestionPoolTable from './QuestionPoolTable'


export default function QuestionPool() {

  const { page, setPage } = usePagination()
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: 'total',
    search: ''
  })



  const searchParams = useSearchParams();
  useEffect(() => {
    const currentView = searchParams.get('view')
    setFilters((prev) => ({ ...prev, difficulty: currentView?.replace('-question', '') || 'easy' }))
  }, [searchParams])


  const memoizedFilters = useMemo(() => {
    if (filters.difficulty == 'total') {
      return {};
    }
    return filters;
  }, [filters])
  const { data ,isPending} = useListQuestions(page, memoizedFilters)
  console.log(data,'data from question pool')

  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button onClick={() => setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD QUESTION</span></Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <QuestionSummaryCard easy_questions={data?.question_pool_data.easy_questions_count??0} total_questions={data?.question_pool_data.total_questions??0} moderate_questions={data?.question_pool_data.moderate_questions_count??0} hard_questions={data?.question_pool_data.hard_questions_count??0} />

        <QuestionPoolTable page_count={data?.pagination.total_pages??0} currentPage={page} onPageChange={setPage} questions={data?.results ?? []} />



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



// function QuestionsTable(){
//   const columns=['S/N','Question','Difficulty','Date Added','Action']
//   return <div className="flex flex-col">

//     <Table data={[]} columns={columns}/>
//   </div>
// }

// function QuestionsTable() {
//   const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
//   return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
//     <div className="flex justify-between px-3">
//       <div className="flex gap-1 flex-col">
//         <h2 className='font-bold'>Questions</h2>
//         <p>Questions added to the platform</p>
//       </div>
//       <div className="flex justify-between gap-2">
//         <div className="flex">
//           <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
//         </div>
//         <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
//         <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
//       </div>
//     </div>
//     <Table data={[]} columns={columns} />
//   </ResponsiveContainer>
// }
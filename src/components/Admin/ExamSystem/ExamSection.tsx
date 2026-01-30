"use client"
import clsx from 'clsx'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ExamCardGoTo } from '../../General/GeneralIcon'
import { GotoIcon } from '../../General/GettingStarted/GettingStartedAssets'
import Button from '../../ui/Button'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import { SummaryIcon } from '../AdminIcons'
// import EmptySession from '../EmptySession'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CreateExamSessionModal from '../../Modals/CreateExamSessionModal'
import EmptySession from '../EmptySession'
import useListExams from '@/hooks/useListExams'
import { formatDate } from '@/utils/formatFileSize'
import useGetValidDate, { useSortedExams } from '@/hooks/useGetValidDate'
import { ExamSessionType } from '@/types/Examtype'
import Spinner from '@/components/ui/spinner/spinner'
import PagePagination from '@/components/ui/Pagination/PagePagination'
import { formatExamTitle } from '@/utils/generalUtils'

export default function ExamSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page") || 1)
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [open, setOpen] = useState(false);
  const { data, isPending } = useListExams(currentPage)



  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [currentPage, pathname, router])







  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={<Button onClick={() => setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm">CREATE EXAM SESSION</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        {
          isPending ? <div className="grid w-full h-screen place-content-center"><Spinner /></div> :
            <QuestionSession currentPage={currentPage} onPageChange={setCurrentPage} total_pages={data?.pagination.total_pages ?? 0} sessions={data?.results ?? []} />
        }
        <ExamSummary total_question={data?.question_pool_data?.total_questions} moderate_question={data?.question_pool_data?.moderate_questions_count} hard_question={data?.question_pool_data?.hard_questions_count} easy_question={data?.question_pool_data?.easy_questions_count} />
      </div>

      <CreateExamSessionModal open={open} close={setOpen} />
    </div>
  )
}


function ExamSummary({ total_question = 0, easy_question = 0, moderate_question = 0, hard_question = 0 }: Readonly<{ total_question?: number, easy_question?: number, moderate_question?: number, hard_question?: number }>) {
  return <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-4 gap-3'>
    <SummaryCard link='total-question' label='TOTAL QUESTION POOL' value={total_question} className='bg-[#E6F7FD] p-3' textColor='text-[#018ABB]' />
    <SummaryCard link='easy-question' label='EASY QUESTION LEVEL' value={easy_question} className='bg-[#E7F6EC] p-3' textColor='text-[#099137]' />
    <SummaryCard link='moderate-question' label='MODERATE QUESTION LEVEL' value={moderate_question} className='bg-[#FEF6E7] p-3' textColor='text-[#AD6F07]' />
    <SummaryCard link='hard-question' label='HARD QUESTION LEVEL' value={hard_question} className='bg-[#FBEAE9] p-3' textColor='text-[#CB1A14]' />

  </ResponsiveContainer>
}


function SummaryCard({ label, className, textColor = 'text-black', value, link }: Readonly<{ className?: string, textColor?: string, value: number, label: string, link: string }>) {
  const pathName = usePathname();
  const searchParams = useSearchParams()
  const href = (() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", link)
    return `${pathName}?${params.toString()}`
  })()

  return <Link href={href} className={clsx("flex cursor-pointer flex-col p-4 gap-2 rounded-[10px]", className)}>
    <div className="flex flex-col gap-1">
      <span><SummaryIcon /></span>
      <span className={clsx(textColor, 'text-sm font-bold ')}>{label}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className='text-2xl font-bold'>{value}</span>
      <span className={clsx('text-sm font-bold', textColor)}><GotoIcon /></span>
    </div>
  </Link>
}

function QuestionSession({ sessions, total_pages, onPageChange, currentPage }: Readonly<{ sessions: ExamSessionType[], total_pages: number, currentPage: number, onPageChange: Dispatch<SetStateAction<number>> }>) {
  const sortedSessions = useSortedExams(sessions)

  return <ResponsiveContainer className='gap-3'>
    {
      sortedSessions.length == 0 && <EmptySession label='No question session has been created yet' desc='Question session set on the platform would appear here ' />
    }


    {sortedSessions.length > 0 &&
      <div className="flex flex-col gap-3">

        <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
          {
            sortedSessions
              // sessions
              .map((val, index) => <ExamSession key={`session-${index + 1}`} id={val.id}
                // applicationDate={val?.exam_date}
                data={val}
              // status={val?.status}
              // applicationDate={val?.created_at}
              // count={val?.question_count} 
              // title={val?.title}
              />)}
        </div>
        {total_pages > 1 && <PagePagination currentPage={currentPage} onPageChange={onPageChange} pageCount={total_pages} />}
      </div>
    }
  </ResponsiveContainer>
}





function ExamSession({ data, id }: Readonly<{ id: string, data: any }>) {


  const pathName = usePathname();
  const searchParams = useSearchParams()
  const href = (() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', 'exam-session')
    params.set("id", id.toString());
    return `${pathName}?${params.toString()}`
  })()



  const { isUpcoming, daysDiff } = useGetValidDate(data.created_at)


  return <Link href={href} className='flex relative mt-8 justify-center flex-col'>
    <div className={clsx('pt-2 pb-7 p-2  absolute w-full -top-8   text-white rounded-t-2xl', isUpcomingExam(data.status) ? 'bg-[#00455E]' : 'bg-[#667185]')}>
      <div className="flex justify-between">
        <span className="text-sm capitalize">
          {/* {isUpcoming
            ? `${daysDiff} Day${daysDiff === 1 ? '' : 's'} to exam`
            : 'Done'} */}


          {data.status}
        </span>

        {/* <span className='text-sm'>{!isActive ? 'Done' : `${daysDiff} Days to exam`}</span> */}
        <span className='font-bold text-sm'>{data.scheduled_date ? formatDate(data.scheduled_date) : 'DD:MM:YYYY'}</span>
      </div>
    </div>
    <div className={clsx("flex flex-col z-10   rounded-2xl p-2", isUpcomingExam(data.status) ? 'bg-[#E6F7FD]' : 'bg-[#F0F2F5]')}>
      <div className={clsx("flex  flex-col gap-1 rounded-lg")}>
        <span className='text-sm uppercase'>{formatExamTitle(data.title)}</span>

        <p className='font-bold text-[2.5rem] '>{data.question_count}</p>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>questions set in this session</span>
          <span><ExamCardGoTo /></span>
        </div>
      </div>
    </div>
  </Link>
}





function isUpcomingExam(status: string) {
  switch (status) {
    case 'concluded':
    case 'cancelled':
      return false;
    case 'draft':
    case 'scheduled':
    case 'ongoing':
      return true;

    default:
      break;
  }
}









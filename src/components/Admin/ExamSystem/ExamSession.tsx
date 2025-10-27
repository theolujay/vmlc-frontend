import Spinner from '@/components/ui/spinner/spinner'
import usePagination from '@/hooks/usePagination'
import useViewExamQuestions from '@/hooks/useViewExamQuestions'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { GotoIcon } from '../../General/GettingStarted/GettingStartedAssets'
import Button from '../../ui/Button'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
import { SummaryIcon } from '../AdminIcons'
import QuestionsTable from '../QuestionsTable'






export default function ExamSession() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id")!);
  const { page, setPage } = usePagination()
  const { data, isPending } = useViewExamQuestions(id)


  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={[<Button key='button-one' className="inline-flex gap-2 border px-2 items-center text-sm"><span>UPLOAD</span></Button>,

      <button key='button-two' className="flex flex-col items-center justify-center w-10 h-full rounded-md border border-gray-300 hover:bg-gray-100">
        <span className=" w-1 h-1 bg-gray-700 rounded-full"></span>
        <span className="w-1 h-1 bg-gray-700 rounded-full my-0.5"></span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
      </button>
      ]} />
      {isPending ? <div className='w-full h-full grid place-content-center'>
        <Spinner />
      </div> :
        <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
          <SessionDetails />
          <QuestionSummaryCard />
          <QuestionsTable page_count={data?.total_pages} currentPage={page} onPageChange={setPage} questions={data?.results ?? []} />
        </div>
      }
    </div>
  )
}


function SessionDetails() {
  return <ResponsiveContainer className='gap-10 p-4 flex flex-col'>
    <div className="flex justify-between">
      <div className='flex flex-col gap-1'>
        <p className='text-sm'>EXAM TITLE</p>
        <h2 className='font-bold text-2xl'>Screening Exam</h2>
      </div>
      <div className="flex flex-col gap-1">
        <span className='text-sm'>DATE CREATED</span>
        <span>08 July, 2025</span>
      </div>
    </div>
    <div className="flex flex-col">
      <p className='text-sm'>DESCRIPTION</p>
      <p>Preliminary exam to determine candidates qualified for the league stage.</p>
    </div>

  </ResponsiveContainer>
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

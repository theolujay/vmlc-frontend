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
import useGetStatOverview from '@/hooks/useGetStatOverview'
import QuestionPoolStats from './QuestionPoolStats'






export default function ExamSession() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const { page, setPage } = usePagination()
  const [filters, setFilters] = useState<Record<string, string>>({
    difficulty: 'total'
  });
  const { data, isPending } = useViewExamQuestions(id, page, filters)
  const { data: statOverview } = useGetStatOverview()

  const competitionTitle = statOverview?.competition?.active_competition || 'Exams & Questions';

  return (
    <div className='flex flex-col gap-1 min-h-screen bg-[#F7F9FC] font-sans'>
      <AdminHeader isExport={false} label={competitionTitle} actionButton={[
        <ExamSessionDropdownDialog exam_id={id} data={data} key='actions' />
      ]} />
      {isPending ? <div className='w-full h-full grid place-content-center'>
        <Spinner />
      </div> :
        <div className="flex flex-col gap-8 mt-8 w-[96%] mx-auto pb-20">
          <SessionDetails 
            data={data}
          />
          <QuestionPoolStats 
            title={data?.title}
            headerLabel="Session Questions"
            activeDifficulty={filters.difficulty || 'total'}
            onDifficultyChange={(difficulty) => setFilters(prev => ({ ...prev, difficulty }))}
            stats={{
              total: data?.questions?.question_pool_data?.total_questions ?? 0,
              easy: data?.questions?.question_pool_data?.easy_questions_count ?? 0,
              moderate: data?.questions?.question_pool_data?.moderate_questions_count ?? 0,
              hard: data?.questions?.question_pool_data?.hard_questions_count ?? 0,
            }}
          />
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


function SessionDetails({ data }: Readonly<{ data?: any }>) {
  const title = formatExamTitle(data?.title);
  const description = data?.description;

  const statusConfig: Record<string, { color: string, label: string }> = {
    draft: { color: "bg-gray-400", label: "Draft" },
    scheduled: { color: "bg-green-500", label: "Scheduled" },
    ongoing: { color: "bg-red-500 animate-pulse", label: "Ongoing" },
    concluded: { color: "bg-blue-500", label: "Concluded" },
    cancelled: { color: "bg-gray-300", label: "Cancelled" },
  };

  const currentStatus = statusConfig[data?.status || ""] || { color: "bg-gray-300", label: data?.status || "Unknown" };

  return <ResponsiveContainer className='gap-8 p-8 flex flex-col bg-white border border-gray-100 rounded-[2rem] shadow-sm'>
    {/* Header Section */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div className='flex flex-col gap-3'>
        <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3E4095]/5 rounded-[1rem] flex items-center justify-center text-[#3E4095]">
                <i className="fas fa-file-invoice text-xl"></i>
            </div>
            <div>
                <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>{data?.competition_title || `Edition ${data?.competition_edition}`}</p>
                <div className="flex items-center space-x-2 mt-0.5">
                    <div className="flex items-center space-x-1.5">
                        <span className={clsx("w-1.5 h-1.5 rounded-full", currentStatus.color)}></span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{currentStatus.label}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    {/* <div className="flex items-center space-x-1.5">
                        <span className={clsx("w-1.5 h-1.5 rounded-full", data?.is_active ? "bg-green-500" : "bg-gray-300")}></span>
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{data?.is_active ? 'Active' : 'Inactive'}</span>
                    </div> */}
                </div>
            </div>
        </div>
        <h2 className='font-bold text-2xl text-gray-800 tracking-tight uppercase'>{title}</h2>
      </div>
      
      <div className="flex flex-col gap-1 md:items-end bg-[#3E4095]/5 p-3 px-5 rounded-xl border border-[#3E4095]/10">
          <span className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Authored By</span>
          <span className="font-bold text-[#3E4095] text-xs">{data?.created_by?.user?.first_name || "VMLC"} {data?.created_by?.user?.last_name || "Staff"}</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Description & Overview */}
        <div className="xl:col-span-2 space-y-5">
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <i className="fas fa-align-left text-[#3E4095] text-[10px]"></i>
                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</h3>
                </div>
                <div className="p-6 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 min-h-[100px] flex items-center">
                    <p className="text-gray-600 leading-relaxed font-medium text-base">
                        {description || "No detailed description provided for this exam session."}
                    </p>
                </div>
            </div>

            {/* Quick Config Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <ConfigMetric 
                    icon="fa-clock" 
                    label="Access Window" 
                    value={`${data?.open_duration_hours || 0} Hours`} 
                    sub="Time the exam remains open"
                />
                <ConfigMetric 
                    icon="fa-stopwatch" 
                    label="Timer" 
                    value={`${data?.countdown_minutes || 0} Minutes`} 
                    sub="Attempt duration per candidate"
                />
            </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-5">
            <div className="flex items-center space-x-2">
                <i className="fas fa-history text-[#3E4095] text-[10px]"></i>
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timeline</h3>
            </div>
            <div className="bg-gray-50/50 rounded-[1.5rem] border border-gray-100 p-6 space-y-6 h-full">
                <TimelineEvent 
                    icon="fa-plus-circle"
                    label="Created On"
                    date={data?.created_at ? formatDate(data.created_at) : 'N/A'}
                    color="text-gray-400"
                    isLast={false}
                />
                <TimelineEvent 
                    icon="fa-calendar-check"
                    label="Scheduled Start"
                    date={data?.scheduled_date ? formatDate(data.scheduled_date) : 'Not Scheduled'}
                    color="text-blue-600"
                    isLast={false}
                />
                <TimelineEvent 
                    icon="fa-calendar-times"
                    label="Concluded At"
                    date={data?.concluded_at ? formatDate(data.concluded_at) : '--'}
                    color="text-amber-600"
                    isLast={true}
                />
            </div>
        </div>
    </div>
  </ResponsiveContainer>
}

function ConfigMetric({ icon, label, value, sub }: { icon: string, label: string, value: string, sub: string }) {
    return (
        <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#3E4095]">
                <i className={`fas ${icon} text-base`}></i>
            </div>
            <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <h4 className="text-lg font-bold text-gray-800 tracking-tight">{value}</h4>
                <p className="text-[8px] font-medium text-gray-400">{sub}</p>
            </div>
        </div>
    );
}

function TimelineEvent({ icon, label, date, color, isLast }: { icon: string, label: string, date: string, color: string, isLast: boolean }) {

    return (

        <div className="relative flex space-x-3">

            {!isLast && <div className="absolute left-4 top-8 bottom-[-24px] w-[1px] bg-gray-100"></div>}

            <div className={clsx("w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 z-10", color)}>

                <i className={`fas ${icon} text-xs`}></i>

            </div>

            <div className="pt-0.5">

                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>

                <p className="text-xs font-bold text-gray-700 mt-0.5 tracking-tight">{date}</p>

            </div>

        </div>

    );

}

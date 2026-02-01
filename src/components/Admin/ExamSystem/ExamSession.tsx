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






export default function ExamSession() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const { page, setPage } = usePagination()
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isPending } = useViewExamQuestions(id, page, filters)


  return (
    <div className='flex flex-col gap-1 min-h-screen bg-[#F7F9FC]'>
      <AdminHeader isExport={false} label='Exam System' actionButton={[
        <ExamSessionDropdownDialog exam_id={id} data={data} key='actions' />
      ]} />
      {isPending ? <div className='w-full h-full grid place-content-center'>
        <Spinner />
      </div> :
        <div className="flex flex-col gap-8 mt-8 w-[96%] mx-auto pb-20">
          <SessionDetails 
            data={data}
          />
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

  return <ResponsiveContainer className='gap-10 p-10 flex flex-col bg-white border border-gray-100 rounded-[2.5rem] shadow-sm'>
    {/* Header Section */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
      <div className='flex flex-col gap-4'>
        <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#3E4095]/5 rounded-[1.25rem] flex items-center justify-center text-[#3E4095]">
                <i className="fas fa-file-invoice text-2xl"></i>
            </div>
            <div>
                <p className='text-[10px] text-gray-400 font-black uppercase tracking-widest'>Competition Edition {data?.competition_edition}</p>
                <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1.5">
                        <span className={clsx("w-2 h-2 rounded-full", currentStatus.color)}></span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{currentStatus.label}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                    {/* <div className="flex items-center space-x-1.5">
                        <span className={clsx("w-2 h-2 rounded-full", data?.is_active ? "bg-green-500" : "bg-gray-300")}></span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{data?.is_active ? 'Active' : 'Inactive'}</span>
                    </div> */}
                </div>
            </div>
        </div>
        <h2 className='font-black text-4xl lg:text-5xl text-gray-800 tracking-tight uppercase'>{title}</h2>
      </div>
      
      <div className="flex flex-col gap-1 md:items-end bg-[#3E4095]/5 p-4 px-6 rounded-2xl border border-[#3E4095]/10">
          <span className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>Authored By</span>
          <span className="font-bold text-[#3E4095] text-sm">{data?.created_by?.full_name || "VMLC Staff"}</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Description & Overview */}
        <div className="xl:col-span-2 space-y-6">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <i className="fas fa-align-left text-[#3E4095] text-xs"></i>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</h3>
                </div>
                <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 min-h-[120px] flex items-center">
                    <p className="text-gray-600 leading-relaxed font-medium text-lg">
                        {description || "No detailed description provided for this exam session."}
                    </p>
                </div>
            </div>

            {/* Quick Config Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <ConfigMetric 
                    icon="fa-clock" 
                    label="Access Window" 
                    value={`${data?.open_duration_hours || 0} Hours`} 
                    sub="Time the exam remains open"
                />
                <ConfigMetric 
                    icon="fa-stopwatch" 
                    label="Countdown Timer" 
                    value={`${data?.countdown_minutes || 0} Minutes`} 
                    sub="Duration per attempt"
                />
            </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <i className="fas fa-history text-[#3E4095] text-xs"></i>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam Timeline</h3>
            </div>
            <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 space-y-8 h-full">
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

function QuestionSummaryCard({ total = 0, easy_question = 0, moderate_question = 0, hard_question = 0 }: Readonly<{ total: number, easy_question: number, moderate_question: number, hard_question: number }>) {
  return <ResponsiveContainer className='p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm'>
    <div className="flex items-center space-x-2 mb-8">
        <i className="fas fa-chart-pie text-[#3E4095] text-xs"></i>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions in Exam</h3>
    </div>
    <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <SummaryMetric label='TOTAL' value={total} color="text-[#3E4095]" />
        <SummaryMetric label='EASY' value={easy_question} color="text-gray-700" />
        <SummaryMetric label='MODERATE' value={moderate_question} color="text-gray-700" />
        <SummaryMetric label='HARD' value={hard_question} color="text-gray-700" />
    </div>
  </ResponsiveContainer>
}

function SummaryMetric({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className='text-[10px] font-black text-gray-400 uppercase tracking-widest block'>{label}</span>
            <span className={clsx('text-4xl font-black tracking-tighter', color)}>{value}</span>
        </div>
    );
}

function ConfigMetric({ icon, label, value, sub }: { icon: string, label: string, value: string, sub: string }) {
    return (
        <div className="flex items-center space-x-5 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#3E4095]">
                <i className={`fas ${icon} text-lg`}></i>
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <h4 className="text-xl font-black text-gray-800 tracking-tight">{value}</h4>
                <p className="text-[9px] font-medium text-gray-400 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

function TimelineEvent({ icon, label, date, color, isLast }: { icon: string, label: string, date: string, color: string, isLast: boolean }) {
    return (
        <div className="relative flex space-x-4">
            {!isLast && <div className="absolute left-5 top-10 bottom-[-32px] w-[2px] bg-gray-100"></div>}
            <div className={clsx("w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 z-10", color)}>
                <i className={`fas ${icon} text-sm`}></i>
            </div>
            <div className="pt-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-gray-700 mt-1 tracking-tight">{date}</p>
            </div>
        </div>
    );
}




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
        <div className="flex flex-col gap-6 mt-4 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto pb-20">
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

  const statusConfig: Record<string, { color: string, textColor: string, bgColor: string, label: string }> = {
    draft: { color: "bg-gray-400", textColor: "text-gray-600", bgColor: "bg-gray-100", label: "Draft" },
    scheduled: { color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50", label: "Scheduled" },
    ongoing: { color: "bg-rose-500 animate-pulse", textColor: "text-rose-700", bgColor: "bg-rose-50", label: "Ongoing" },
    concluded: { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", label: "Concluded" },
    cancelled: { color: "bg-gray-300", textColor: "text-gray-500", bgColor: "bg-gray-50", label: "Cancelled" },
  };

  const currentStatus = statusConfig[data?.status || ""] || { color: "bg-gray-300", textColor: "text-gray-500", bgColor: "bg-gray-50", label: data?.status || "Unknown" };

  return <ResponsiveContainer className='gap-6 p-8 flex flex-col bg-white border border-gray-100 rounded-[2rem] shadow-sm relative overflow-hidden'>
    {/* Subtle Decorative Element */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3E4095]/[0.02] rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
    
    {/* Header Section */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
      <div className='flex flex-col gap-3'>
        <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-[#3E4095] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#3E4095]/20">
                <i className="fas fa-file-invoice text-lg"></i>
            </div>
            <div>
                <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-0.5'>{data?.competition_title || `Edition ${data?.competition_edition}`}</p>
                <div className="flex items-center space-x-3">
                    <div className={clsx("flex items-center space-x-2 px-2.5 py-1 rounded-full border", currentStatus.bgColor, currentStatus.textColor, "border-current/10")}>
                        <span className={clsx("w-1.5 h-1.5 rounded-full", currentStatus.color)}></span>
                        <span className="text-[8px] font-black uppercase tracking-wider">{currentStatus.label}</span>
                    </div>
                </div>
            </div>
        </div>
        <h2 className='font-black text-2xl text-gray-900 tracking-tight leading-tight'>{title}</h2>
      </div>
      
      <div className="flex items-center gap-3 bg-gray-50/80 backdrop-blur-sm p-3 px-4 rounded-xl border border-gray-100/50 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <i className="fas fa-user-tie text-[#3E4095] text-[10px]"></i>
          </div>
          <div className="flex flex-col">
            <span className='text-[7px] text-gray-400 font-black uppercase tracking-widest'>Authored By</span>
            <span className="font-bold text-gray-800 text-xs tracking-tight">{data?.created_by?.user?.first_name || "VMLC"} {data?.created_by?.user?.last_name || "Staff"}</span>
          </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
        {/* Description & Overview */}
        <div className="xl:col-span-2 space-y-6">
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Description</h3>
                </div>
                <div className="p-6 bg-gray-50/30 rounded-[1.5rem] border border-gray-100/80 min-h-[100px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#3E4095]/10 group-hover:bg-[#3E4095]/30 transition-colors"></div>
                    <p className="text-gray-600 leading-relaxed font-medium text-base">
                        {description || "No detailed description provided for this exam session."}
                    </p>
                </div>
            </div>

            {/* Quick Config Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="w-1 h-4 bg-[#3E4095] rounded-full"></div>
                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Timeline</h3>
            </div>
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 space-y-6 shadow-sm relative">
                <div className="absolute left-[39px] top-10 bottom-10 w-[1.5px] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50"></div>
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
        <div className="flex items-center space-x-4 p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3E4095]/10 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-[#3E4095] group-hover:bg-[#3E4095] group-hover:text-white transition-all duration-300 shadow-inner">
                <i className={`fas ${icon} text-lg`}></i>
            </div>
            <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">{label}</p>
                <h4 className="text-lg font-black text-gray-900 tracking-tight">{value}</h4>
                <p className="text-[9px] font-semibold text-gray-400 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

function TimelineEvent({ icon, label, date, color, isLast }: { icon: string, label: string, date: string, color: string, isLast: boolean }) {
    return (
        <div className="relative flex items-center space-x-4 group">
            <div className={clsx(
                "w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 z-10 transition-all duration-300 group-hover:scale-110", 
                color
            )}>
                <i className={`fas ${icon} text-xs`}></i>
            </div>
            <div className="flex flex-col">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-black text-gray-800 mt-0.5 tracking-tight">{date}</p>
            </div>
        </div>
    );
}

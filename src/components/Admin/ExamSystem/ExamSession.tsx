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

  const statusConfig: Record<string, { color: string, textColor: string, bgColor: string, label: string }> = {
    draft: { color: "bg-gray-400", textColor: "text-gray-600", bgColor: "bg-gray-100", label: "Draft" },
    scheduled: { color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50", label: "Scheduled" },
    ongoing: { color: "bg-rose-500 animate-pulse", textColor: "text-rose-700", bgColor: "bg-rose-50", label: "Ongoing" },
    concluded: { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", label: "Concluded" },
    cancelled: { color: "bg-gray-300", textColor: "text-gray-500", bgColor: "bg-gray-50", label: "Cancelled" },
  };

  const currentStatus = statusConfig[data?.status || ""] || { color: "bg-gray-300", textColor: "text-gray-500", bgColor: "bg-gray-50", label: data?.status || "Unknown" };

  return <ResponsiveContainer className='gap-8 p-10 flex flex-col bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative overflow-hidden'>
    {/* Subtle Decorative Element */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#3E4095]/[0.02] rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
    
    {/* Header Section */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
      <div className='flex flex-col gap-4'>
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3E4095] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#3E4095]/20">
                <i className="fas fa-file-invoice text-xl"></i>
            </div>
            <div>
                <p className='text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>{data?.competition_title || `Edition ${data?.competition_edition}`}</p>
                <div className="flex items-center space-x-3">
                    <div className={clsx("flex items-center space-x-2 px-3 py-1 rounded-full border", currentStatus.bgColor, currentStatus.textColor, "border-current/10")}>
                        <span className={clsx("w-2 h-2 rounded-full", currentStatus.color)}></span>
                        <span className="text-[9px] font-black uppercase tracking-wider">{currentStatus.label}</span>
                    </div>
                </div>
            </div>
        </div>
        <h2 className='font-black text-3xl text-gray-900 tracking-tight leading-tight'>{title}</h2>
      </div>
      
      <div className="flex items-center gap-4 bg-gray-50/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-100/50 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <i className="fas fa-user-tie text-[#3E4095] text-sm"></i>
          </div>
          <div className="flex flex-col">
            <span className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Authored By</span>
            <span className="font-bold text-gray-800 text-sm tracking-tight">{data?.created_by?.user?.first_name || "VMLC"} {data?.created_by?.user?.last_name || "Staff"}</span>
          </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 relative z-10">
        {/* Description & Overview */}
        <div className="xl:col-span-2 space-y-8">
            <div className="space-y-4">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-4 bg-[#3E4095] rounded-full"></div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Description</h3>
                </div>
                <div className="p-8 bg-gray-50/30 rounded-[2rem] border border-gray-100/80 min-h-[120px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#3E4095]/10 group-hover:bg-[#3E4095]/30 transition-colors"></div>
                    <p className="text-gray-600 leading-relaxed font-medium text-lg">
                        {description || "No detailed description provided for this exam session."}
                    </p>
                </div>
            </div>

            {/* Quick Config Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
                <div className="w-1.5 h-4 bg-[#3E4095] rounded-full"></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Timeline</h3>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-8 shadow-sm relative">
                <div className="absolute left-[47px] top-12 bottom-12 w-[2px] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50"></div>
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
        <div className="flex items-center space-x-5 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3E4095]/10 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#3E4095] group-hover:bg-[#3E4095] group-hover:text-white transition-all duration-300 shadow-inner">
                <i className={`fas ${icon} text-xl`}></i>
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">{label}</p>
                <h4 className="text-xl font-black text-gray-900 tracking-tight">{value}</h4>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">{sub}</p>
            </div>
        </div>
    );
}

function TimelineEvent({ icon, label, date, color, isLast }: { icon: string, label: string, date: string, color: string, isLast: boolean }) {
    return (
        <div className="relative flex items-center space-x-5 group">
            <div className={clsx(
                "w-10 h-10 rounded-2xl bg-white border-2 border-gray-50 shadow-sm flex items-center justify-center shrink-0 z-10 transition-all duration-300 group-hover:scale-110", 
                color
            )}>
                <i className={`fas ${icon} text-sm`}></i>
            </div>
            <div className="flex flex-col">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-black text-gray-800 mt-0.5 tracking-tight">{date}</p>
            </div>
        </div>
    );
}

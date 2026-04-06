"use client"
import clsx from 'clsx'
import Link from 'next/link'
import React, { Dispatch, SetStateAction, useEffect, useState, useMemo } from 'react'
import { ExamCardGoTo } from '../../General/GeneralIcon'
import ResponsiveContainer from '../../ui/ResponsiveContainer'
import AdminHeader from '../AdminHeader'
// import EmptySession from '../EmptySession'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import CreateExamSessionModal from '../../Modals/CreateExamSessionModal'
import EmptySession from '../EmptySession'
import useListExams from '@/hooks/useListExams'
import { formatDate, formatDateTime } from '@/utils/formatFileSize'
import { useSortedExams } from '@/hooks/useGetValidDate'
import useGetStatOverview from '@/hooks/useGetStatOverview'
import { ExamSessionType } from '@/types/Examtype'
import Spinner from '@/components/ui/spinner/spinner'
import PagePagination from '@/components/ui/Pagination/PagePagination'
import { formatExamTitle } from '@/utils/generalUtils'

import dynamic from 'next/dynamic'
import usePagination from '@/hooks/usePagination'
import useListQuestions from '@/hooks/useListQuestions'
import useListRankings from '@/hooks/useListRankings'
import { RankingSnapshotType } from '@/types/Examtype'
import QuestionPoolTable from './QuestionPoolTable'
import QuestionPoolStats from './QuestionPoolStats'
import useGetAccountMgt from '@/hooks/useGetAccountMgt'
import PublishRankingModal from '@/components/Modals/PublishRankingModal'

const AddQuestionModal = dynamic(() => import('../../Modals/AddQuestionModal'), {
  ssr: false,
});

export default function ExamSection() {
  const { data: accountMgt, isPending: isAccountMgtPending } = useGetAccountMgt();
  const userRole = accountMgt?.role;
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');
  const isAdminOrAbove = ['admin', 'manager', 'superadmin'].includes(userRole || '');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Exam Pagination
  const initialPage = Number(searchParams.get("page") || 1)
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Modals
  const [openCreateSession, setOpenCreateSession] = useState(false);
  const [openAddQuestion, setOpenAddQuestion] = useState(false);

  // Data Fetching
  const { data: examData, isPending: isExamsPending } = useListExams(currentPage)
  const { data: statOverview } = useGetStatOverview()

  const { data: rankingData, isPending: isRankingsPending } = useListRankings(1) // Show first few snapshots

  // Question Pool Logic
  const { page: questionPage, setPage: setQuestionPage } = usePagination()
  const [questionFilters, setQuestionFilters] = useState<Record<string, string>>({
    difficulty: 'total',
    search: ''
  })

  const memoizedQuestionFilters = useMemo(() => {
    const { difficulty, search } = questionFilters;
    const cleaned: Record<string, string> = {};
    if (search.trim() !== '') cleaned.search = search.trim();
    if (difficulty !== 'total') cleaned.difficulty = difficulty;
    return cleaned;
  }, [questionFilters]);

  const { data: questionData } = useListQuestions(questionPage, memoizedQuestionFilters)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const urlPage = params.get("page");

    if (urlPage !== currentPage.toString()) {
      params.set("page", currentPage.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [currentPage, pathname, router, searchParams])

  const competitionTitle = statOverview?.competition?.active_competition || 'Exams & Questions';

  if (isAccountMgtPending) return <div className="grid w-full h-[60vh] place-content-center"><Spinner /></div>

  return (
    <div className='flex flex-col gap-1 font-sans'>
      <AdminHeader
        isExport={false}
        label={competitionTitle}
        actionButton={[
          isModeratorOrAbove && (
          <button
            key="add-question"
            onClick={() => setOpenAddQuestion(true)}
            className="inline-flex items-center gap-2.5 bg-white text-[#3E4095] border border-[#3E4095]/20 px-3 md:px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-gray-50 transition-all uppercase shadow-sm active:scale-95"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>ADD QUESTION</span>
          </button>
          ),
          isAdminOrAbove && (
            <button
              key="create-session"
              onClick={() => setOpenCreateSession(true)}
              className="inline-flex items-center gap-2.5 bg-[#3E4095] text-white px-3 md:px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-[#2d2f6e] transition-all uppercase shadow-lg shadow-[#3E4095]/20 active:scale-95"
            >
              <i className="fas fa-calendar-plus text-xs"></i>
              <span>CREATE EXAM</span>
            </button>
          )
        ].filter(Boolean) as React.ReactNode[]}
      />

      <div className="flex flex-col gap-6 mt-4 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto pb-20">
        {/* Exams Section */}
        {isModeratorOrAbove && (
          <div className='flex flex-col gap-4'>
            <div className="flex items-center space-x-2.5 px-2">
              <i className="fas fa-layer-group text-[#3E4095] text-[10px]"></i>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Exam Sessions</h3>
            </div>
            {
              isExamsPending ? <div className="grid w-full h-[20vh] place-content-center"><Spinner /></div> :
                <QuestionSession canViewDetails={isAdminOrAbove} currentPage={currentPage} onPageChange={setCurrentPage} total_pages={examData?.pagination.total_pages ?? 0} sessions={examData?.results ?? []} />
            }
            </div>
            )}

            {/* Performance Ranking Section */}
            {isModeratorOrAbove && (
            <div className='flex flex-col gap-4'>
            <div className="flex items-center space-x-2.5 px-2">
              <i className="fas fa-chart-line text-[#3E4095] text-[10px]"></i>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ranking Tables</h3>
            </div>
            {
              isRankingsPending ? <div className="grid w-full h-[15vh] place-content-center"><Spinner /></div> :
                <PerformanceRanking canViewDetails={isAdminOrAbove} rankings={rankingData?.results ?? []} userRole={userRole} />
            }

            </div>
            )}

            {/* Global Question Pool Section */}        <div className="space-y-4">
          <QuestionPoolStats
            title='Questions Stats'
            activeDifficulty={questionFilters.difficulty}
            onDifficultyChange={(difficulty) => setQuestionFilters(prev => ({ ...prev, difficulty }))}
            stats={{
              total: questionData?.question_pool_data?.total_questions ?? 0,
              easy: questionData?.question_pool_data?.easy_questions_count ?? 0,
              moderate: questionData?.question_pool_data?.moderate_questions_count ?? 0,
              hard: questionData?.question_pool_data?.hard_questions_count ?? 0,
            }}
          />

          <QuestionPoolTable
            handleSearch={setQuestionFilters}
            page_count={questionData?.pagination.total_pages ?? 0}
            currentPage={questionPage}
            onPageChange={setQuestionPage}
            questions={questionData?.results ?? []}
            hasNext={questionData?.pagination.has_next}
            hasPrevious={questionData?.pagination.has_previous}
          />
        </div>
      </div>

      <CreateExamSessionModal open={openCreateSession} close={setOpenCreateSession} />
      <AddQuestionModal open={openAddQuestion} close={setOpenAddQuestion} />
    </div>
  )
}


function QuestionSession({ sessions, total_pages, onPageChange, currentPage, canViewDetails }: Readonly<{ sessions: ExamSessionType[], total_pages: number, currentPage: number, onPageChange: Dispatch<SetStateAction<number>>, canViewDetails?: boolean }>) {
  const sortedSessions = useSortedExams(sessions)

  return <div className='flex flex-col gap-6'>
    {/* <div className="flex items-center space-x-2 px-2">
      <i className="fas fa-list-ul text-[#3E4095] text-[10px]"></i>
      <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Sessions</h3>
    </div> */}

    <ResponsiveContainer className='gap-6 p-0 bg-transparent border-none shadow-none'>
      {
        sortedSessions.length == 0 && <EmptySession label='No exam sessions yet' desc='Create one using "Create Exam"' />
      }

      {sortedSessions.length > 0 &&
        <div className="flex flex-col gap-8">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {
              sortedSessions.map((val, index) => <ExamSession key={`session-${index + 1}`} id={val.id} data={val} canViewDetails={canViewDetails} />)
            }
          </div>
          {total_pages > 1 && (
            <div className="flex justify-center pt-4">
              <PagePagination currentPage={currentPage} onPageChange={onPageChange} pageCount={total_pages} />
            </div>
          )}
        </div>
      }
    </ResponsiveContainer>
  </div>
}





function ExamSession({ data, id, canViewDetails }: Readonly<{ id: string, data: ExamSessionType, canViewDetails?: boolean }>) {
  const pathName = usePathname();
  const searchParams = useSearchParams()
  const href = (() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', 'exam-session')
    params.set("id", id.toString());
    return `${pathName}?${params.toString()}`
  })()

  const statusConfig: Record<string, { color: string, bg: string, label: string }> = {
    draft: { color: "text-gray-500", bg: "bg-gray-100", label: "Draft" },
    scheduled: { color: "text-green-600", bg: "bg-green-50", label: "Scheduled" },
    ongoing: { color: "text-red-600", bg: "bg-red-50", label: "Ongoing" },
    concluded: { color: "text-[#3E4095]", bg: "bg-blue-50", label: "Concluded" },
    cancelled: { color: "text-gray-400", bg: "bg-gray-50", label: "Cancelled" },
  };

  const currentStatus = statusConfig[data.status] || { color: "text-gray-400", bg: "bg-gray-50", label: data.status };

  const content = (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className={clsx("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5", currentStatus.bg, currentStatus.color)}>
          <span className={clsx("w-1 h-1 rounded-full", currentStatus.color.replace('text', 'bg'))}></span>
          {currentStatus.label}
        </div>
        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
          {data.scheduled_date ? formatDate(data.scheduled_date) : 'Not Scheduled'}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className='text-sm font-bold text-gray-800 uppercase line-clamp-1 group-hover:text-[#3E4095] transition-colors'>{formatExamTitle(data.title)}</h4>
        {/* <p className='text-[9px] text-gray-400 font-medium line-clamp-1'>{data.competition_title}</p> */}
      </div>

      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col">
          <span className='text-[2.5rem] font-bold tracking-tight text-gray-900 leading-none'>{data.question_count}</span>
          <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1'>Questions</span>
        </div>
        {canViewDetails && (
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-[#3E4095] group-hover:text-white transition-all">
            <ExamCardGoTo />
          </div>
        )}
      </div>
    </div>
  );

  const cardClassName = clsx(
    'group flex flex-col bg-white border border-gray-100 rounded-[2rem] shadow-sm transition-all overflow-hidden',
    canViewDetails ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-90 cursor-default'
  );

  if (!canViewDetails) {
    return (
      <div className={cardClassName}>
        {content}
        <div className="h-1 w-full bg-gray-50"></div>
      </div>
    );
  }

  return (
    <Link href={href} className={cardClassName}>
      {content}
      <div className="h-1 w-full bg-gray-50 group-hover:bg-[#3E4095]/10 transition-colors"></div>
    </Link>
  );
}

function PerformanceRanking({ rankings, canViewDetails, userRole }: { rankings: RankingSnapshotType[], canViewDetails?: boolean, userRole?: string }) {
  return (
    <div className='flex flex-col gap-6'>
      <ResponsiveContainer className='gap-6 p-0 bg-transparent border-none shadow-none'>
        {rankings.length === 0 && (
          <EmptySession
            label='No ranking table available'
            desc='Ranking tables will appear here after exams are concluded and ranking is generated'
          />
        )}

        {rankings.length > 0 && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rankings.map((ranking) => (
              <RankingSnapshotCard key={ranking.id} ranking={ranking} canViewDetails={canViewDetails} userRole={userRole} />
            ))}
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function RankingSnapshotCard({ ranking, canViewDetails, userRole }: { ranking: RankingSnapshotType, canViewDetails?: boolean, userRole?: string }) {
  const isSuperAdmin = ['superadmin'].includes(userRole || '');

  const router = useRouter();
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const handleViewRanking = (e: React.MouseEvent) => {
    if (!canViewDetails) return;
    e.preventDefault();
    router.push(`/admin/competition?view=ranking&id=${ranking.exam.id}&title=${encodeURIComponent(ranking.exam.title)}`);
  };

  const handlePublishRanking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenPublishModal(true);
  };

  return (
    <>
      <div
        onClick={handleViewRanking}
        className={clsx(
          'group flex flex-col bg-white border border-gray-100 rounded-[2rem] shadow-sm transition-all overflow-hidden',
          canViewDetails ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-90 cursor-default'
        )}
        title={canViewDetails ? "View Ranking" : ""}
      >
        <div className="p-6 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div className={clsx(
              "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5",
              ranking.is_published ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
            )}>
              <span className={clsx("w-1 h-1 rounded-full", ranking.is_published ? "bg-emerald-600" : "bg-orange-600")}></span>
              {ranking.is_published ? "Published" : "Draft"}
            </div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
              {ranking.is_published && ranking.published_at ? formatDate(ranking.published_at) : formatDate(ranking.created_at)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h4 className='text-sm font-bold text-gray-800 uppercase line-clamp-1 group-hover:text-[#3E4095] transition-colors'>
              {formatExamTitle(ranking.exam.title)}
            </h4>
            {ranking.scheduled_publish_at && (
              <p className='text-[8px] text-gray-400 font-medium flex items-center gap-1.5'>
                <i className="fas fa-history text-[8px]"></i>
                Scheduled at {formatDateTime(ranking.scheduled_publish_at)}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between mt-2">
            <div className="flex flex-col">
              <span className='text-[2rem] font-bold tracking-tight text-gray-900 leading-none'>
                {ranking.entries_count}
              </span>
              <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1'>Candidates</span>
            </div>

            <div className="flex gap-2">
              {!ranking.is_published && (
                <button
                  onClick={handlePublishRanking}
                  disabled={!isSuperAdmin}
                  className={clsx(
                    "w-10 h-10 rounded-xl bg-emerald-50/40 flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50",
                    isSuperAdmin ? "hover:cursor-pointer" : "hover:cursor-not-allowed"
              )}
                  title={isSuperAdmin ? "Publish ranking" : "Only Superadmin can publish rankings"}
                >
                  <i className="fas fa-upload"></i>
                </button>
              )}
              {canViewDetails && (
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-[#3E4095] group-hover:text-white transition-all">
                  <ExamCardGoTo />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={clsx(
          "h-1 w-full transition-colors",
          ranking.is_published ? "bg-emerald-50 group-hover:bg-emerald-100" : "bg-orange-50 group-hover:bg-orange-100"
        )}></div>
      </div>
      <PublishRankingModal
        examId={ranking.exam.id}
        examTitle={ranking.exam.title}
        open={openPublishModal}
        close={setOpenPublishModal}
      />
    </>
  );
}

// function RankingIcon({ className }: { className?: string }) {
//   return (
//     <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   );
// }

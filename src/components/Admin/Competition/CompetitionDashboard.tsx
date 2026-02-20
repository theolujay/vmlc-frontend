import React, { useMemo, useState } from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import CompetitionStats from './CompetitionStats';
import StageBoard, { CompetitionStage } from './CompetitionProgress';
import ExamStatus from './ExamStatus';
import LeaderboardSummary from './LeaderboardSummary';
import RankingSummary from './RankingSummary';
import useGetCompetitionDashboard from '@/hooks/useGetCompetitionDashboard';
import { useAuth } from '@/contexts/AuthProvider';
import { capitalizeWord } from '@/utils/capitalizeWords';
import PromoteCandidatesModal from '@/components/Modals/PromoteCandidatesModal';
import InfoBoard from '@/components/General/Portal/DashboardParts/InfoBoard';
import { useNotifications } from '@/contexts/NotificationProvider';

interface CompetitionDashboardProps {
  onViewFullLeaderboard?: () => void;
  onViewFullRanking?: (id: string, title: string) => void;
  onViewRanking?: (id: string, title: string) => void;
  onViewCandidateDetail?: (params: {
    candidate_id: string,
    exam_id?: string,
    isLeagueCumulative?: boolean,
    stage?: string,
    round?: string
  }) => void;
}

const CompetitionDashboard: React.FC<CompetitionDashboardProps> = ({
  onViewFullLeaderboard,
  onViewFullRanking,
  onViewRanking,
  onViewCandidateDetail
}) => {
  const { authState } = useAuth();
  const userRole = authState?.user?.role;
  const isVolunteer = userRole === 'volunteer';
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');
  // const isAdminOrAbove = ['admin', 'manager', 'superadmin'].includes(userRole || '');
  const isManagerOrAbove = ['manager', 'superadmin'].includes(userRole || '');

  const { data, isLoading, error, refetch } = useGetCompetitionDashboard();
  const { notifications, markAsRead } = useNotifications();
  const [openPromoteModal, setOpenPromoteModal] = useState(false);

  // Notification Queue Logic: info and success go to InfoBoard
  const activeNotifications = useMemo(() => {
    return notifications
      .filter(n => !n.is_read)
      .filter(n => {
        const type = (n.type || '').toLowerCase();
        return type === 'info' || type === 'success';
      })
      .map(n => ({
        ...n,
        type: (n.type || 'info').toLowerCase() as 'info' | 'success' | 'error'
      }));
  }, [notifications]);

  const currentNotification = activeNotifications.length > 0
    ? { message: activeNotifications[0].message, type: activeNotifications[0].type }
    : null;

  const handleDismissNotification = () => {
    if (activeNotifications.length > 0) {
      markAsRead(activeNotifications[0].id);
    }
  };

  const handleView = (id: string) => {
    if (isVolunteer) return;
    const exam = data?.exams.find(e => e.id === id);
    if (onViewRanking && exam && exam.ranking_status === 'published') {
      onViewRanking(id, exam.title);
    } else {
      // Fallback or handle operational navigation
      console.log(`Navigating to operational details for ${id}`);
    }
  };

  const handleGenerate = (id: string) => {
    if (isVolunteer) return;
    console.log(`Generating results for ${id}`);
    // Implementation for generating results
  };

  const handlePublish = (id: string) => {
    if (isVolunteer) return;
    if (confirm('Are you sure you want to publish results? This will be visible to candidates.')) {
        console.log(`Publishing results for ${id}`);
        // Implementation for publishing results
    }
  };

  const handleEdit = (id: string) => {
    if (isVolunteer) return;
     console.log(`Editing exam ${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 min-h-screen">
        <AdminHeader label="Competition" actionButton={undefined} />
        <div className="flex items-center justify-center p-20 flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-2 min-h-screen">
        <AdminHeader label="Competition" actionButton={undefined} />
        <div className="flex flex-col items-center justify-center p-20 flex-1 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Failed to load competition data</h2>
          <p className="text-gray-600 mb-6">Please check your connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-[#3E4095] text-white rounded-full font-bold hover:bg-[#2d2f6e] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="flex flex-col gap-2">
        <AdminHeader
          label="Competition"
          actionButton={[
            isManagerOrAbove && (
              <button
                key="promote-candidates"
                onClick={() => setOpenPromoteModal(true)}
                className="inline-flex items-center gap-2.5 bg-white text-emerald-600 border border-emerald-600/20 px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-emerald-50 transition-all uppercase shadow-sm active:scale-95"
              >
                <i className="fas fa-users-cog text-xs"></i>
                <span>Promote Candidates</span>
              </button>
            )
          ].filter(Boolean) as React.ReactNode[]}
        />

          <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
            <InfoBoard
              message={currentNotification?.message}
              type={currentNotification?.type}
              onDismiss={handleDismissNotification}
            />

            <CompetitionStats
              candidatesStats={{
                enrolled: data.stats.enrolled,
                active: data.stats.active,
                eliminated: data.stats.eliminated
              }}
            />

            <StageBoard
              currentStage={capitalizeWord(data.progress.current_stage) as CompetitionStage}
              leagueStatus={{
                currentRound: data.progress.current_round,
                totalRounds: data.progress.total_rounds,
                publishedRounds: data.progress.published_rounds
              }}
            />

            <ExamStatus
              exams={data.exams}
              onView={handleView}
              onGenerate={handleGenerate}
              onPublish={handlePublish}
              onEdit={handleEdit}
              canInteract={isModeratorOrAbove}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-10">
              <LeaderboardSummary
                entries={data.leaderboard_summary}
                onViewFull={isModeratorOrAbove ? (onViewFullLeaderboard || (() => {})) : undefined}
                onViewCandidate={isModeratorOrAbove ? ((id) => onViewCandidateDetail?.({
                  candidate_id: id,
                  isLeagueCumulative: true
                })) : undefined}
              />
              <RankingSummary
                examTitle={data.latest_ranking_summary?.exam_title || "Latest Exam"}
                entries={data.latest_ranking_summary?.entries || []}
                onViewFull={isModeratorOrAbove && onViewFullRanking && data.latest_ranking_summary ?
                  (() => onViewFullRanking(data.latest_ranking_summary!.exam_id, data.latest_ranking_summary!.exam_title))
                  : undefined}
                onViewCandidate={isModeratorOrAbove ? ((id) => onViewCandidateDetail?.({
                  candidate_id: id,
                  exam_id: data.latest_ranking_summary?.exam_id,
                  stage: data.progress.current_stage,
                  round: String(data.progress.current_round)
                })) : undefined}
              />
            </div>
          </div>
          <PromoteCandidatesModal open={openPromoteModal} close={setOpenPromoteModal} />
      </div>
  );
};

export default CompetitionDashboard;
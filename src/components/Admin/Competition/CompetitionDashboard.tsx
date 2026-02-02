import React from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import CompetitionStats from './CompetitionStats';
import StageBoard, { CompetitionStage } from './CompetitionProgress';
import ExamStatus from './ExamStatus';
import LeaderboardSummary from './LeaderboardSummary';
import StandingsSummary from './StandingsSummary';
import useGetCompetitionDashboard from '@/hooks/useGetCompetitionDashboard';
import { useAuth } from '@/contexts/AuthProvider';
import { capitalizeWord } from '@/utils/capitalizeWords';

interface CompetitionDashboardProps {
  onViewFullLeaderboard?: () => void;
  onViewFullStandings?: () => void;
  onViewStandings?: (id: string, title: string) => void;
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
  onViewFullStandings,
  onViewStandings,
  onViewCandidateDetail 
}) => {
  const { authState } = useAuth();
  const userRole = authState?.user?.role;
  const isVolunteer = userRole === 'volunteer';
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const { data, isLoading, error, refetch } = useGetCompetitionDashboard();

  const handleView = (id: string) => {
    if (isVolunteer) return;
    const exam = data?.exams.find(e => e.id === id);
    if (onViewStandings && exam && exam.standings_status === 'published') {
      onViewStandings(id, exam.title);
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
          actionButton={undefined} 
        />

          <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
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
              <StandingsSummary
                examTitle={data.latest_standings_summary?.exam_title || "Latest Exam"}
                entries={data.latest_standings_summary?.entries || []}
                onViewFull={isModeratorOrAbove ? (onViewFullStandings || (() => {})) : undefined}
                onViewCandidate={isModeratorOrAbove ? ((id) => onViewCandidateDetail?.({ 
                  candidate_id: id, 
                  exam_id: data.latest_standings_summary?.exam_id,
                  stage: data.progress.current_stage,
                  round: String(data.progress.current_round)
                })) : undefined}
              />
            </div>
          </div>
      </div>
  );
};

export default CompetitionDashboard;

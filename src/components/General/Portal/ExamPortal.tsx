"use client"
import React, { useState, useMemo, useCallback } from 'react';
import PageLayout from '../Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import { useNotifications } from '@/contexts/NotificationProvider';
import StageProgress, { CompetitionStage } from './DashboardParts/StageProgress';
import InfoBoard from './DashboardParts/InfoBoard';
import PrimaryAction from './DashboardParts/PrimaryAction';
import Performance from './DashboardParts/Performance';
import ExamHistory from './DashboardParts/ExamHistory';
import HelpdeskButton from './DashboardParts/HelpdeskButton';
import ProfileModal from '@/components/Modals/ProfileModal';
import { AvailableExamType } from '@/types/Examtype';
import FullLeagueLeaderboard from '@/components/Admin/Competition/FullLeagueLeaderboard';

function ExamPortal() {
  const { isPending, data, refetch } = useGetExamPortal();
  const { notifications, markAsRead } = useNotifications();
  const user = useGetCurrentUser();
  const [isProfileNoticeDismissed, setIsProfileNoticeDismissed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const stageProgressData = data?.enrollment_stage_progress;
  const activeExamData = data?.active_exam;
  const performance = data?.performance;
  const examHistory = data?.exam_history;

  // Use synced profile data from AuthProvider via useGetCurrentUser
  const profile = user?.profile;

  // Notification Queue Logic: INFO and SUCCESS go to InfoBoard
  // Only show notifications that are NOT read
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

  const showProfileNotice = !isProfileNoticeDismissed &&
    (profile?.is_setup_complete === false);

  const currentNotification = activeNotifications.length > 0
    ? { message: activeNotifications[0].message, type: activeNotifications[0].type, isProfile: false }
    : showProfileNotice
      ? { message: "Your profile is incomplete. Please update your profile to ensure you don't miss any important updates.", type: 'info' as const, isProfile: true }
      : null;

  const handleDismissNotification = useCallback(() => {
    if (activeNotifications.length > 0) {
      const notificationId = activeNotifications[0].id;
      markAsRead(notificationId);
    } else if (showProfileNotice) {
      setIsProfileNoticeDismissed(true);
    }
  }, [activeNotifications, markAsRead, showProfileNotice]);

  const determineStage = useCallback((stage: string): 'SCREENING' | 'LEAGUE' | 'FINAL' | null => {
    if (!stage) return null;
    const normalizedStage = stage.toUpperCase();
    if (normalizedStage.includes('LEAGUE')) return 'LEAGUE';
    if (normalizedStage.includes('FINAL')) return 'FINAL';
    if (normalizedStage.includes('SCREENING')) return 'SCREENING';
    return null;
  }, []);

  if (isPending) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
        </div>
      </PageLayout>
    );
  }

  // Use synced profile data
  const candidateName = profile?.user
    ? `${profile.user.first_name} ${profile.user.last_name}`
    : "Candidate";

  // Derive current stage from data
  const currentStage: 'SCREENING' | 'LEAGUE' | 'FINAL' = determineStage(stageProgressData?.current_stage || '') || 'SCREENING';
  const leagueRound = stageProgressData?.current_round || activeExamData?.round || 1;

  // Map Active Exam to AvailableExamType for PrimaryAction component
  const currentExam: AvailableExamType | null = activeExamData ? {
    id: activeExamData.id,
    title: activeExamData.title,
    description: activeExamData.description,
    open_duration_hours: activeExamData.starts_at && activeExamData.ends_at
      ? (new Date(activeExamData.ends_at).getTime() - new Date(activeExamData.starts_at).getTime()) / (1000 * 60 * 60)
      : activeExamData.duration_minutes / 60,
    countdown_minutes: activeExamData.duration_minutes || 0,
    question_count: activeExamData.question_count || 0,
    round: activeExamData.round,
    scheduled_date: new Date(activeExamData.starts_at),
    stage: activeExamData.stage,
    stage_display: activeExamData.stage.toUpperCase(),
    status: activeExamData.status,
    access_status: activeExamData.access_status,
    attempt: activeExamData.attempt
  } : null;

  // Map history
  const history = (examHistory || []).map(item => ({
    exam: item.exam_title,
    score: item.score,
    percentage: item.percentage,
    date: new Date(item.date),
    exam_stage: item.stage,
    isPublished: item.is_published
  }));

  // Map Performance Snapshot
  const leagueRanking = performance?.league_leaderboard ? {
      current_rank: performance.league_leaderboard.overall_rank,
      position: performance.league_leaderboard.overall_rank,
      total_candidates: performance.league_leaderboard.total_candidates,
      rank_change: performance.league_leaderboard.rank_change,
      as_of_round: performance.league_leaderboard.as_of_round,
      is_active: performance.league_leaderboard.is_active,
      score: performance.league_leaderboard.total_score
  } : null;

  const screeningRanking = performance?.screening_ranking ? {
      current_rank: performance.screening_ranking.rank,
      position: performance.screening_ranking.rank,
      total_candidates: performance.screening_ranking.total_candidates,
      exam_id: performance.screening_ranking.exam_id,
      exam_title: performance.screening_ranking.exam_title,
      is_active: true,
      score: performance.screening_ranking.score,
      percentile: performance.screening_ranking.percentile
  } : null;

  const finalRanking = performance?.final_ranking ? {
      current_rank: performance.final_ranking.rank,
      position: performance.final_ranking.rank,
      total_candidates: performance.final_ranking.total_candidates,
      exam_id: performance.final_ranking.exam_id,
      exam_title: performance.final_ranking.exam_title,
      is_active: true,
      score: performance.final_ranking.score,
      percentile: performance.final_ranking.percentile
  } : null;

  // Qualification Threshold logic
  let qualificationThreshold = 0;
  let cutoffDisplay = '-';
  const activeRanking = currentStage === 'SCREENING' ? screeningRanking : currentStage === 'FINAL' ? finalRanking : leagueRanking;

  if (stageProgressData?.qualification_status?.advancement_policy) {
      const { mode, value } = stageProgressData.qualification_status.advancement_policy;
      if (mode === 'top_percent') {
           cutoffDisplay = `Top ${value * 100}%`;
           const total = activeRanking?.total_candidates;
           if (total) {
               qualificationThreshold = Math.ceil(total * value);
           }
      } else {
          qualificationThreshold = value;
          cutoffDisplay = `Top ${value}`;
      }
  }

  // Determine if awaiting results
  const hasTakenExam = stageProgressData?.has_taken_current_round || activeExamData?.access_status === 'submitted' || false;
  let isAwaitingResults = false;

  if (hasTakenExam) {
      if (currentStage === 'LEAGUE') {
          const roundsPublished = stageProgressData?.published_rounds || 0;
          isAwaitingResults = !leagueRanking || roundsPublished < leagueRound;
      } else {
          isAwaitingResults = !activeRanking;
      }
  }

  if (activeExamData?.status === 'awaiting_results' && !activeRanking) {
      isAwaitingResults = true;
  }

  return (
    <PageLayout>
      <div className="relative space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 font-sans">
        <br></br>
        {showLeaderboard ? (
          <FullLeagueLeaderboard isPublicView={true} onBack={() => setShowLeaderboard(false)} />
        ) : (
          <>
            <div className="mb-8 border-b border-[#E4E7EC] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#101828]">Welcome, {candidateName.split(' ')[0]}</h1>
                <p className="text-[#667185] mt-1 text-base">You&apos;re now in the exam portal. Wishing you success ahead!</p>
              </div>
              {(profile?.school_name || profile?.current_class) && (
                <div className="text-left md:text-right">
                  <p className="text-sm font-bold text-[#3E4095] uppercase tracking-wide">{profile.school_name || 'Student'}</p>
                  <p className="text-[11px] text-[#667185] font-medium uppercase">{profile.current_class || 'Candidate'}</p>
                </div>
              )}
            </div>


            {/* INFO BOARD */}
            <InfoBoard
              message={currentNotification?.message}
              type={currentNotification?.type}
              onDismiss={handleDismissNotification}
              actionLabel={currentNotification?.isProfile ? "Update Profile" : undefined}
              onAction={() => setIsProfileOpen(true)}
            />

            {/* STAGE PROGRESS */}
            <StageProgress
              currentStage={currentStage === 'SCREENING' ? CompetitionStage.SCREENING : currentStage === 'LEAGUE' ? CompetitionStage.LEAGUE : CompetitionStage.FINAL}
              leagueRound={leagueRound}
              totalRounds={stageProgressData?.total_rounds}
            />

            {/* PRIMARY ACTION */}
            <PrimaryAction
              exam={currentExam}
              candidateName={candidateName}
              isRankingAvailable={!!activeRanking}
              onCountdownEnd={refetch}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PERFORMANCE SNAPSHOT */}
              <Performance
                leagueRanking={leagueRanking}
                screeningRanking={screeningRanking}
                finalRanking={finalRanking}
                stage={currentStage}
                leagueRound={leagueRound}
                totalRounds={stageProgressData?.total_rounds}
                qualificationThreshold={qualificationThreshold}
                cutoffDisplay={cutoffDisplay}
                hasTakenExam={hasTakenExam}
                isQualified={stageProgressData?.qualification_status?.is_qualified}
                isAwaitingResults={isAwaitingResults}
                isActive={activeRanking?.is_active}
                qualificationMessage={stageProgressData?.qualification_status?.message}
                onViewLeaderboard={() => setShowLeaderboard(true)}
              />

              {/* EXAM HISTORY */}
              <ExamHistory history={history} />
            </div>
          </>
        )}

        {/* PERSISTENT ACTIONS - HELPDESK */}
        <HelpdeskButton
            currentStage={currentStage}
            candidateName={candidateName}
        />
      </div>

      {profile && (
        <ProfileModal
          id={profile.user.id}
          open={isProfileOpen}
          close={setIsProfileOpen}
          isOwnProfile={true}
        />
      )}
    </PageLayout>
  );
}

export default withAuthentication(ExamPortal);
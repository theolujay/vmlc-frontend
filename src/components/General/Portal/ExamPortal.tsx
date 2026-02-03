
"use client"
import React, { useState, useEffect } from 'react';
import PageLayout from '../Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import StageProgress, { CompetitionStage } from './DashboardParts/StageProgress';
import InfoBoard from './DashboardParts/InfoBoard';
import PrimaryAction from './DashboardParts/PrimaryAction';
import PerformanceSnapshot from './DashboardParts/PerformanceSnapshot';
import ExamHistory from './DashboardParts/ExamHistory';
import SupportChat from './DashboardParts/SupportChat';
import ProfileModal from '@/components/Modals/ProfileModal';
import { AvailableExamType } from '@/types/Examtype';

function ExamPortal() {
  const { isPending, data } = useGetExamPortal();
  const user = useGetCurrentUser();
  const [infoMessage, setInfoMessage] = useState<string | undefined>("Stay sharp! The competition is about to begin.");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const candidateContext = data?.candidate_context;
  const stageProgressData = data?.stage_progress;
  const activeExamData = data?.active_exam;
  const performanceSnapshot = data?.performance_snapshot;
  const examHistory = data?.exam_history;

  useEffect(() => {
    // Priority: 1. API Notifications, 2. Profile Setup Check (API or User Context)
    
    // Check Notifications first
    const infoNotifications = candidateContext?.notifications?.info || [];
    const errorNotifications = candidateContext?.notifications?.error || [];
    const successNotifications = candidateContext?.notifications?.success || [];

    if (errorNotifications.length > 0) {
      setInfoMessage(errorNotifications[0].message);
      return;
    }
    
    if (successNotifications.length > 0) {
      setInfoMessage(successNotifications[0].message);
      return;
    }

    if (infoNotifications.length > 0) {
       setInfoMessage(infoNotifications[0].message);
       return;
    }

    // Check Setup status
    const isSetupComplete = candidateContext?.is_setup_complete ?? user?.profile?.is_setup_complete;
    
    if (isSetupComplete === false) {
      setInfoMessage("Your profile is incomplete. Please update your profile to ensure you don't miss any important updates.");
    } else {
       // Clear message if setup is complete and no notifications (and default message was shown)
       if (infoMessage === "Stay sharp! The competition is about to begin." && isSetupComplete) {
           // Optional: Keep the default welcome message or clear it. 
           // setInfoMessage(undefined); 
       }
    }
  }, [user, candidateContext, infoMessage]);

  if (isPending) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
        </div>
      </PageLayout>
    );
  }

  // Use login response or API data
  const candidateName = candidateContext?.full_name 
    ? candidateContext.full_name
    : user?.profile?.user 
      ? `${user.profile.user.first_name} ${user.profile.user.last_name}` 
      : "Candidate";
  

  const determineStage = (stage: string): 'SCREENING' | 'LEAGUE' | 'FINAL' | null => {
    if (!stage) return null;
    const normalizedStage = stage.toUpperCase();
    if (normalizedStage.includes('LEAGUE')) return 'LEAGUE';
    if (normalizedStage.includes('FINAL')) return 'FINAL';
    if (normalizedStage.includes('SCREENING')) return 'SCREENING';
    return null;
  };

  // Derive current stage from data
  const currentStage: 'SCREENING' | 'LEAGUE' | 'FINAL' = determineStage(stageProgressData?.current_stage || '') || 'SCREENING';
  const leagueWeek = stageProgressData?.current_round || activeExamData?.round || 1; 

  // Map Active Exam to AvailableExamType for PrimaryAction component
  const currentExam: AvailableExamType | null = activeExamData ? {
    id: activeExamData.id,
    title: activeExamData.title,
    open_duration_hours: activeExamData.duration_minutes / 60,
    countdown_minutes: 0,
    question_count: activeExamData.question_count || 0, 
    round: activeExamData.round,
    scheduled_date: new Date(activeExamData.starts_at),
    stage: activeExamData.stage,
    stage_display: activeExamData.stage.toUpperCase(),
    has_participated: activeExamData.has_participated,
    status: activeExamData.status
  } : null;

  // Map history
  const history = (examHistory || []).map(item => ({
    exam: item.exam_title,
    score: item.percentage,
    date: new Date(item.date),
    exam_stage: item.stage
  }));

  // Map Performance Snapshot
  const leagueRanking = performanceSnapshot?.league_leaderboard ? {
      current_rank: performanceSnapshot.league_leaderboard.overall_rank,
      position: performanceSnapshot.league_leaderboard.overall_rank,
      total_candidates: performanceSnapshot.league_leaderboard.total_candidates
  } : null;

  const screeningRanking = performanceSnapshot?.screening_standing ? {
      current_rank: performanceSnapshot.screening_standing.rank,
      position: performanceSnapshot.screening_standing.rank,
      total_candidates: performanceSnapshot.screening_standing.total_candidates
  } : null;
  
  // Qualification Threshold logic
  let qualificationThreshold = 0;
  if (stageProgressData?.qualification_status?.advancement_policy) {
      const { mode, value } = stageProgressData.qualification_status.advancement_policy;
      if (mode === 'top_percent') {
           const total = currentStage === 'SCREENING' ? screeningRanking?.total_candidates : leagueRanking?.total_candidates;
           if (total) {
               qualificationThreshold = Math.ceil(total * value);
           }
      } else {
          qualificationThreshold = value;
      }
  }


  return (
    <PageLayout>
      <div className="relative space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 font-sans">
        <br></br>
        <div className="mb-8 border-b border-[#E4E7EC] pb-6">
          <h1 className="text-3xl font-bold text-[#101828]">Welcome</h1>
          <p className="text-[#667185] mt-1 text-base">You&apos;re now in the exam portal. Wishing you success ahead!</p>
        </div>

        {/* STAGE PROGRESS */}
        <StageProgress 
          currentStage={currentStage === 'SCREENING' ? CompetitionStage.SCREENING : currentStage === 'LEAGUE' ? CompetitionStage.LEAGUE : CompetitionStage.FINAL} 
          leagueWeek={leagueWeek} 
        />

        {/* INFO BOARD */}
        <InfoBoard 
          message={infoMessage} 
          onDismiss={() => setInfoMessage(undefined)} 
          actionLabel={candidateContext?.is_setup_complete === false || user?.profile?.is_setup_complete === false ? "Update Profile" : undefined}
          onAction={() => setIsProfileOpen(true)}
        />

        {/* PRIMARY ACTION */}
        <PrimaryAction 
          exam={currentExam} 
          candidateName={candidateName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERFORMANCE SNAPSHOT */}
          <PerformanceSnapshot 
            leagueRanking={leagueRanking}
            screeningRanking={screeningRanking}
            stage={currentStage}
            currentWeek={leagueWeek}
            qualificationThreshold={qualificationThreshold}
            hasTakenExam={stageProgressData?.has_taken_current_round || false}
            isQualified={stageProgressData?.qualification_status?.is_qualified}
            qualificationMessage={stageProgressData?.qualification_status?.message}
          />

          {/* EXAM HISTORY */}
          <ExamHistory history={history} />
        </div>

        {/* PERSISTENT ACTIONS - SUPPORT CHAT */}
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
            {isSupportOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-[24px] shadow-2xl border border-[#E4E7EC] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    <SupportChat 
                        currentStage={currentStage} 
                        candidateName={candidateName}
                        onClose={() => setIsSupportOpen(false)} 
                    />
                </div>
            )}
            <button 
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                    isSupportOpen ? 'bg-[#4A4DA8] text-gray-300' : 'bg-[#3E4095] text-white'
                }`}
            >
                {isSupportOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
                <span className="font-bold text-sm tracking-wide">Help?</span>
            </button>
        </div>
      </div>
      
      {user && (
        <ProfileModal 
          id={user.profile.user.id}
          open={isProfileOpen}
          close={setIsProfileOpen}
          isOwnProfile={true}
        />
      )}
    </PageLayout>
  );
}


export default withAuthentication(ExamPortal);
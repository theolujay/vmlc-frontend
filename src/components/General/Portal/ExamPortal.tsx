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

function ExamPortal() {
  const { isPending, data } = useGetExamPortal();
  const user = useGetCurrentUser();
  const [infoMessage, setInfoMessage] = useState<string | undefined>("Stay sharp! The competition is about to begin.");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user && user.profile && user.profile.is_setup_complete === false) {
      setInfoMessage("Your profile is incomplete. Please update your profile to ensure you don't miss any important updates.");
    }
  }, [user]);

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
  const candidateName = user?.profile?.user 
    ? `${user.profile.user.first_name} ${user.profile.user.last_name}` 
    : data?.candidate_info 
      ? `${data.candidate_info.first_name} ${data.candidate_info.last_name}` 
      : "Candidate";
  
  const recentResults = data?.recent_results || [];
  const leagueRanking = data?.league_leaderboard_ranking;
  const screeningRanking = data?.screening_standings_ranking;
  const stageProgress = data?.stage_progress;

  const determineStage = (stage: string): 'SCREENING' | 'LEAGUE' | 'FINAL' | null => {
    if (!stage) return null;
    const normalizedStage = stage.toUpperCase();
    if (normalizedStage.includes('LEAGUE')) return 'LEAGUE';
    if (normalizedStage.includes('FINAL')) return 'FINAL';
    if (normalizedStage.includes('SCREENING')) return 'SCREENING';
    return null;
  };

  // Derive current stage from data
  const currentStage: 'SCREENING' | 'LEAGUE' | 'FINAL' = determineStage(stageProgress?.current_stage || '') || 'SCREENING';
  
  const currentExam = data?.next_exam || null;
  const leagueWeek = stageProgress?.current_round || currentExam?.round || 1; 

  // Map history
  const history = recentResults.map(score => ({
    exam: score.exam,
    score: score.score,
    date: score.date,
    exam_stage: score.exam_stage
  }));

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
          actionLabel={user?.profile?.is_setup_complete === false ? "Update Profile" : undefined}
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
            qualificationThreshold={stageProgress?.qualification_threshold_score}
            hasTakenExam={stageProgress?.has_taken_exam || false}
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

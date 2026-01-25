"use client"
import React, { useState } from 'react';
import PageLayout from '../Layout/PageLayout';
import withAuthentication from '@/hocs/withAuthentication';
import useGetExamPortal from '@/hooks/useGetExamPortal';
import StageProgress, { CompetitionStage } from './DashboardParts/StageProgress';
import InfoBoard from './DashboardParts/InfoBoard';
import PrimaryAction from './DashboardParts/PrimaryAction';
import PerformanceSnapshot from './DashboardParts/PerformanceSnapshot';
import ExamHistory from './DashboardParts/ExamHistory';
import SupportChat from './DashboardParts/SupportChat';

function ExamPortal() {
  const { isPending, data } = useGetExamPortal();
  const [infoMessage, setInfoMessage] = useState<string | undefined>("Welcome to Verboheit Mathematics League Competition. Please check your stage progress and upcoming exams below.");
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  if (isPending) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3E4095]"></div>
        </div>
      </PageLayout>
    );
  }

  // Use API data
  const candidateName = data?.candidate_info ? `${data.candidate_info.first_name} ${data.candidate_info.last_name}` : "Candidate";
  
  const availableExams = data?.available_exams || [];
  const recentScores = data?.recent_scores || [];
  const leaderboardRanking = data?.leaderboard_ranking;

  // Derive state from data
  let currentStage: 'SCREENING' | 'LEAGUE' | 'FINAL' = 'SCREENING';
  
  if (availableExams.length > 0) {
      const examStage = availableExams[0].stage.toUpperCase();
      if (examStage.includes('LEAGUE')) currentStage = 'LEAGUE';
      else if (examStage.includes('FINAL')) currentStage = 'FINAL';
      else currentStage = 'SCREENING';
  } else if (recentScores.length > 0) {
      const lastExam = recentScores[0]; 
      const lastStage = lastExam.exam_stage.toUpperCase();
      if (lastStage.includes('LEAGUE')) currentStage = 'LEAGUE';
      else if (lastStage.includes('FINAL')) currentStage = 'FINAL';
  }

  const currentExam = availableExams.length > 0 ? availableExams[0] : null;
  const leagueWeek = currentExam?.level || 1; 

  // Map history
  const history = recentScores.map(score => ({
    exam: score.exam,
    score: score.score,
    date: score.date,
    exam_stage: score.exam_stage
  }));

  const rank = leaderboardRanking?.position || 0;
  const totalCandidates = leaderboardRanking?.total_candidates || 0;

  return (
    <PageLayout>
      <div className="relative space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 font-sans">
        
        <div className="mb-8 border-b border-[#E4E7EC] pb-6">
          <h1 className="text-3xl font-bold text-[#101828]">Hello, {candidateName}</h1>
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
        />

        {/* PRIMARY ACTION */}
        <PrimaryAction 
          exam={currentExam} 
          candidateName={candidateName}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERFORMANCE SNAPSHOT */}
          <PerformanceSnapshot 
            rank={rank} 
            totalCandidates={totalCandidates} 
            stage={currentStage}
            currentWeek={leagueWeek}
            qualificationThreshold={20}
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
    </PageLayout>
  );
}


export default withAuthentication(ExamPortal);

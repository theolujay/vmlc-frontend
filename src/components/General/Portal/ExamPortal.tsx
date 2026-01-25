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
import { 
  DUMMY_AVAILABLE_EXAM, 
  DUMMY_CANDIDATE_NAME, 
  DUMMY_LEADERBOARD_RANKING, 
  DUMMY_RECENT_SCORES 
} from './DashboardParts/dummyData';

function ExamPortal() {
  const { isPending, data } = useGetExamPortal();
  const [infoMessage, setInfoMessage] = useState<string | undefined>("Welcome to Verboheit Mathematics League Competition. Please check your stage progress and upcoming exams below.");

  if (isPending) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  // Use API data or fallback to dummy data
  const candidateName = data?.candidate_info?.name || DUMMY_CANDIDATE_NAME;
  
  const availableExams = (data?.available_exams && data.available_exams.length > 0) 
    ? data.available_exams 
    : [DUMMY_AVAILABLE_EXAM];

  const recentScores = (data?.recent_scores && data.recent_scores.length > 0)
    ? data.recent_scores
    : DUMMY_RECENT_SCORES;

  const leaderboardRanking = data?.leaderboard_ranking?.total_candidates 
    ? data.leaderboard_ranking 
    : DUMMY_LEADERBOARD_RANKING;

  // Derive state from (potentially dummy) data
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

  const rank = leaderboardRanking.position;
  const totalCandidates = leaderboardRanking.total_candidates;

  return (
    <PageLayout>
      <div className="space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 font-sans">
        
        <div className="mb-8 border-b border-[#E4E7EC] pb-6">
          <h1 className="text-3xl font-bold text-[#101828]">Welcome {candidateName}! 👋</h1>
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
      </div>
    </PageLayout>
  );
}

export default withAuthentication(ExamPortal);

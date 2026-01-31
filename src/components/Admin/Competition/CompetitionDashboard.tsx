import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompetitionHeader from './CompetitionHeader';
import StageBoard, { CompetitionStage } from './StageBoard';
import ResultsList, { CompetitionExam } from './ResultsList';
import LeaderboardSummary from './LeaderboardSummary';
import { CandidateType } from '@/types/LeaderBoardType';

// Mock Data
const MOCK_STATS = {
  enrolled: 1575,
  active: 612,
  eliminated: 636,
  awaiting: 412
};

const MOCK_LEAGUE_STATUS = {
  currentRound: 3,
  totalRounds: 6,
  publishedRounds: 2
};

const MOCK_EXAMS: CompetitionExam[] = [
  {
    id: 'screening-1',
    title: 'Screening Exam',
    stage: 'Screening',
    status: 'completed',
    standings_status: 'published',
    stats: { candidates_sat: 10230, avg_score: 55.2 },
    actions: { can_generate: false, can_publish: false, can_view: true, can_edit: false }
  },
  {
    id: 'league-1',
    title: 'League - Round 1',
    stage: 'League',
    status: 'concluded',
    standings_status: 'published',
    stats: { candidates_sat: 850, avg_score: 62.4, absent: 200 },
    actions: { can_generate: false, can_publish: false, can_view: true, can_edit: false }
  },
  {
    id: 'league-2',
    title: 'League - Round 2',
    stage: 'League',
    status: 'concluded',
    standings_status: 'published',
    stats: { candidates_sat: 840, avg_score: 64.1, absent: 190 },
    actions: { can_generate: false, can_publish: false, can_view: true, can_edit: false }
  },
  {
    id: 'league-3',
    title: 'League - Round 3',
    stage: 'League',
    status: 'completed', // Time is up, but not generated
    standings_status: 'draft', // Actually, let's say generated but draft
    stats: { candidates_sat: 835 },
    actions: { can_generate: false, can_publish: true, can_view: true, can_edit: false }
  },
  {
    id: 'final-1',
    title: 'Final Exam',
    stage: 'Final',
    status: 'draft',
    standings_status: 'none',
    actions: { can_generate: false, can_publish: false, can_view: false, can_edit: true }
  }
];

const MOCK_TOP_CANDIDATES: CandidateType[] = [
  { rank: 1, score: 372.5, percentage: 92, candidate: { id: 'c1', full_name: 'Candidate A', school_name: 'School A', profile_picture: null } },
  { rank: 2, score: 369.0, percentage: 91, candidate: { id: 'c2', full_name: 'Candidate B', school_name: 'School B', profile_picture: null } },
  { rank: 3, score: 365.0, percentage: 90, candidate: { id: 'c3', full_name: 'Candidate C', school_name: 'School C', profile_picture: null } },
];

const CompetitionDashboard: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<CompetitionExam[]>(MOCK_EXAMS);

  const handleView = (id: string) => {
    // Navigate to exam details
    console.log(`Navigating to exam ${id}`);
    router.push(`/admin/exams/${id}`); 
  };

  const handleGenerate = (id: string) => {
    console.log(`Generating results for ${id}`);
    // In real app, call API
  };

  const handlePublish = (id: string) => {
    if (confirm('Are you sure you want to publish results? This will be visible to candidates.')) {
        console.log(`Publishing results for ${id}`);
        // Optimistic update for demo
        setExams(prev => prev.map(e => 
          e.id === id ? { ...e, standings_status: 'published', actions: { ...e.actions, can_publish: false } } : e
        ));
    }
  };

  const handleEdit = (id: string) => {
     console.log(`Editing exam ${id}`);
     router.push(`/admin/exams/${id}/edit`);
  };

  const handleViewLeaderboard = () => {
      router.push('/admin/leaderboard');
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <CompetitionHeader 
        stats={MOCK_STATS} 
        globalStatus="League · Round 3 of 6"
      />

      <StageBoard 
        currentStage={CompetitionStage.LEAGUE}
        leagueStatus={MOCK_LEAGUE_STATUS}
      />

      <ResultsList 
        exams={exams}
        onView={handleView}
        onGenerate={handleGenerate}
        onPublish={handlePublish}
        onEdit={handleEdit}
      />

      <LeaderboardSummary 
        topCandidates={MOCK_TOP_CANDIDATES}
        onViewFull={handleViewLeaderboard}
      />
    </div>
  );
};

export default CompetitionDashboard;

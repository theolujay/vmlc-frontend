import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/Admin/AdminHeader';
import CompetitionStats from './CompetitionStats';
import StageBoard, { CompetitionStage } from './CompetitionProgress';
import ExamStatus from './ExamStatus';
import { CompetitionExam } from './ExamResultRow';
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
    title: 'Screening',
    status: 'concluded',
    standings_status: 'published',
    stats: { candidates_sat: 10230, avg_score: 55.2 },
    actions: { can_view: true }
  },
  {
    id: 'league-1',
    title: 'League - Round 1',
    status: 'concluded',
    standings_status: 'ready',
    stats: { candidates_sat: 850, avg_score: 62.4, absent: 200 },
    actions: { can_view: true }
  },
  {
    id: 'league-2',
    title: 'League - Round 2',
    status: 'ongoing',
    standings_status: 'pending',
    // stats: { candidates_sat: 840, avg_score: 64.1, absent: 190 },
    actions: { can_view: false }
  },
  {
    id: 'league-3',
    title: 'League - Round 3',
    status: 'scheduled',
    standings_status: 'pending', // Actually, let's say generated but draft
    // stats: { candidates_sat: 835 },
    actions: { can_view: false }
  },
];

const MOCK_TOP_CANDIDATES: CandidateType[] = [
  { rank: 1, score: 372.5, percentage: 92, profile: { id: 'c1', full_name: 'Candidate A', school_name: 'School A', profile_picture: null } },
  { rank: 2, score: 369.0, percentage: 91, profile: { id: 'c2', full_name: 'Candidate B', school_name: 'School B', profile_picture: null } },
  { rank: 3, score: 365.0, percentage: 90, profile: { id: 'c3', full_name: 'Candidate C', school_name: 'School C', profile_picture: null } },
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

      <div className="flex flex-col gap-2">
        <AdminHeader 
          label="Competition" 
          actionButton={undefined} 
        />
        {/* <div className="relative space-y-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10 font-sans"> */}

          <div className="flex flex-col gap-3 sm:gap-4 mt-3 w-full sm:w-[96%] px-2 sm:px-0 sm:mx-auto">
            <CompetitionStats 
              candidatesStats={MOCK_STATS} 
            />

            <StageBoard 
              currentStage={CompetitionStage.LEAGUE}
              leagueStatus={MOCK_LEAGUE_STATUS}
            />

            <ExamStatus 
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
        {/* </div> */}
      </div>
  );
};

export default CompetitionDashboard;
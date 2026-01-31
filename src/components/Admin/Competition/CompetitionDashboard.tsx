import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/Admin/AdminHeader';
import CompetitionStats from './CompetitionStats';
import StageBoard, { CompetitionStage } from './CompetitionProgress';
import ExamStatus from './ExamStatus';
import { CompetitionExam } from './ExamResultRow';
import LeaderboardSummary, { LeaderboardEntry } from './LeaderboardSummary';
import StandingsSummary, { StandingsEntry } from './StandingsSummary';

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
    actions: { can_view: false }
  },
  {
    id: 'league-3',
    title: 'League - Round 3',
    status: 'scheduled',
    standings_status: 'pending', 
    actions: { can_view: false }
  },
];

const MOCK_TOP_CANDIDATES: LeaderboardEntry[] = [
  { overall_rank: 1, total_score: "372.50", rank_change: 0, candidate: 'c1', candidate_name: 'Candidate A', school_name: 'St. Peters College' },
  { overall_rank: 2, total_score: "369.00", rank_change: 2, candidate: 'c2', candidate_name: 'Candidate B', school_name: 'Victory Academy' },
  { overall_rank: 3, total_score: "365.00", rank_change: -1, candidate: 'c3', candidate_name: 'Candidate C', school_name: 'Greenwood High' },
];

const MOCK_STANDINGS: StandingsEntry[] = [
  { rank: 1, exam_score: "95.50", percentile: 99.9, candidate: 's1', candidate_name: 'John Doe', candidate_email: 'john@example.com', school_name: 'St. Peters College' },
  { rank: 2, exam_score: "92.00", percentile: 98.5, candidate: 's2', candidate_name: 'Jane Smith', candidate_email: 'jane@example.com', school_name: 'Victory Academy' },
  { rank: 3, exam_score: "89.50", percentile: 97.2, candidate: 's3', candidate_name: 'Alice Brown', candidate_email: 'alice@example.com', school_name: 'Greenwood High' },
];

interface CompetitionDashboardProps {
  onViewFullLeaderboard?: () => void;
  onViewFullStandings?: () => void;
  onViewStandings?: (id: string, title: string) => void;
}

const CompetitionDashboard: React.FC<CompetitionDashboardProps> = ({ 
  onViewFullLeaderboard, 
  onViewFullStandings,
  onViewStandings 
}) => {
  const router = useRouter();
  const [exams, setExams] = useState<CompetitionExam[]>(MOCK_EXAMS);

  const handleView = (id: string) => {
    const exam = exams.find(e => e.id === id);
    if (onViewStandings && exam && (exam.standings_status === 'published' || exam.standings_status === 'ready')) {
      onViewStandings(id, exam.title);
    } else {
      // Fallback or navigate to exam details if not a standings view
      console.log(`Navigating to exam details for ${id}`);
      router.push(`/admin/exams/${id}`); 
    }
  };

  const handleGenerate = (id: string) => {
    console.log(`Generating results for ${id}`);
  };

  const handlePublish = (id: string) => {
    if (confirm('Are you sure you want to publish results? This will be visible to candidates.')) {
        console.log(`Publishing results for ${id}`);
        setExams(prev => prev.map(e => 
          e.id === id ? { ...e, standings_status: 'published', actions: { ...e.actions, can_publish: false } } : e
        ));
    }
  };

  const handleEdit = (id: string) => {
     console.log(`Editing exam ${id}`);
     router.push(`/admin/exams/${id}/edit`);
  };

  return (
      <div className="flex flex-col gap-2">
        <AdminHeader 
          label="Competition" 
          actionButton={undefined} 
        />

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LeaderboardSummary 
                entries={MOCK_TOP_CANDIDATES}
                onViewFull={onViewFullLeaderboard || (() => {})}
              />
              <StandingsSummary
                examTitle="League - Round 1"
                entries={MOCK_STANDINGS}
                onViewFull={onViewFullStandings || (() => {})}
              />
            </div>
          </div>
      </div>
  );
};

export default CompetitionDashboard;
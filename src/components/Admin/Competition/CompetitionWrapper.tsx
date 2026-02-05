import React, { useState, useEffect } from 'react';
import CompetitionDashboard from './CompetitionDashboard';
import FullLeagueLeaderboard from './FullLeagueLeaderboard';
import FullRanking from './FullRanking';
import ViewCandidateDetails from '../Leaderboard/ViewCandidateDetails';
import { useAuth } from '@/contexts/AuthProvider';
import { useSearchParams } from 'next/navigation';

type ViewState = 'dashboard' | 'leaderboard' | 'ranking' | 'candidate-details';

interface DetailContext {
    candidate_id: string;
    exam_id?: string;
    isLeagueCumulative?: boolean;
    round?: string;
    stage?: string;
    previousView: ViewState;
}

const CompetitionWrapper: React.FC = () => {
  const { authState } = useAuth();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view') as ViewState;
  const idParam = searchParams.get('id');
  const titleParam = searchParams.get('title');

  const userRole = authState?.user?.role;
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const [currentView, setView] = useState<ViewState>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedExamTitle, setSelectedExamTitle] = useState<string>('');
  const [detailContext, setDetailContext] = useState<DetailContext | null>(null);

  useEffect(() => {
    if (viewParam === 'ranking' && idParam) {
      setSelectedExamId(idParam);
      setSelectedExamTitle(titleParam || 'Exam Ranking');
      setView('ranking');
    } else if (viewParam === 'leaderboard') {
      setView('leaderboard');
    }
  }, [viewParam, idParam, titleParam]);

  const handleViewRanking = (id?: string, title?: string) => {
    if (!isModeratorOrAbove) return;
    if (id) setSelectedExamId(id);
    if (title) setSelectedExamTitle(title);
    setView('ranking');
  };

  const handleViewCandidateDetails = ({ 
    candidate_id, 
    exam_id, 
    isLeagueCumulative, 
    stage, 
    round 
  }: { 
    candidate_id: string, 
    exam_id?: string, 
    isLeagueCumulative?: boolean,
    stage?: string,
    round?: string
  }) => {
    if (!isModeratorOrAbove) return;
    setDetailContext({
        candidate_id,
        exam_id,
        isLeagueCumulative,
        stage,
        round,
        previousView: currentView
    });
    setView('candidate-details');
  };

  return (
    <div className="w-full font-sans">
      {currentView === 'dashboard' && (
        <CompetitionDashboard 
          onViewFullLeaderboard={isModeratorOrAbove ? () => setView('leaderboard') : undefined}
          onViewFullRanking={isModeratorOrAbove ? (id, title) => handleViewRanking(id, title) : undefined}
          onViewRanking={isModeratorOrAbove ? handleViewRanking : undefined}
          onViewCandidateDetail={isModeratorOrAbove ? handleViewCandidateDetails : undefined}
        />
      )}

      {currentView === 'leaderboard' && (
        <div className="p-4 sm:p-8">
          <FullLeagueLeaderboard 
            onBack={() => setView('dashboard')} 
            onViewDetails={isModeratorOrAbove ? (id) => handleViewCandidateDetails({ 
              candidate_id: id, 
              isLeagueCumulative: true 
            }) : undefined}
          />
        </div>
      )}

      {currentView === 'ranking' && (
        <div className="p-4 sm:p-8">
          <FullRanking 
            onBack={() => setView('dashboard')} 
            examId={selectedExamId}
            examTitle={selectedExamTitle}
            onViewDetails={isModeratorOrAbove ? (id) => handleViewCandidateDetails({ 
              candidate_id: id, 
              exam_id: selectedExamId,
              stage: 'League', // Default or derived from selectedExamTitle
              round: selectedExamTitle.includes('Round') ? selectedExamTitle.split('Round')[1].trim() : '1'
            }) : undefined}
          />
        </div>
      )}

      {currentView === 'candidate-details' && detailContext && (
        <div className="p-4 sm:p-8">
          <ViewCandidateDetails 
            candidate_id={detailContext.candidate_id}
            exam_id={detailContext.exam_id}
            isLeagueCumulative={detailContext.isLeagueCumulative}
            stage={detailContext.stage}
            round={detailContext.round}
            onBack={() => setView(detailContext.previousView)}
          />
        </div>
      )}
    </div>
  );
};

export default CompetitionWrapper;

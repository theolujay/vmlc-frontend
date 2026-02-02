import React, { useState } from 'react';
import CompetitionDashboard from './CompetitionDashboard';
import FullLeagueLeaderboard from './FullLeagueLeaderboard';
import FullStandings from './FullStandings';
import ViewCandidateDetails from '../Leaderboard/ViewCandidateDetails';
import { useAuth } from '@/contexts/AuthProvider';

type ViewState = 'dashboard' | 'leaderboard' | 'standings' | 'candidate-details';

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
  const userRole = authState?.user?.role;
  const isModeratorOrAbove = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole || '');

  const [currentView, setView] = useState<ViewState>('dashboard');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [selectedExamTitle, setSelectedExamTitle] = useState<string>('');
  const [detailContext, setDetailContext] = useState<DetailContext | null>(null);

  const handleViewStandings = (id?: string, title?: string) => {
    if (!isModeratorOrAbove) return;
    if (id) setSelectedExamId(id);
    if (title) setSelectedExamTitle(title);
    setView('standings');
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
          onViewFullStandings={isModeratorOrAbove ? (id, title) => handleViewStandings(id, title) : undefined}
          onViewStandings={isModeratorOrAbove ? handleViewStandings : undefined}
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

      {currentView === 'standings' && (
        <div className="p-4 sm:p-8">
          <FullStandings 
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
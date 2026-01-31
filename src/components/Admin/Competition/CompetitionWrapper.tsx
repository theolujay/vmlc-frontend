import React, { useState } from 'react';
import CompetitionDashboard from './CompetitionDashboard';
import FullLeagueLeaderboard from './FullLeagueLeaderboard';
import FullStandings from './FullStandings';
import ViewCandidateDetails from '../Leaderboard/ViewCandidateDetails';

type ViewState = 'dashboard' | 'leaderboard' | 'standings' | 'candidate-details';

interface DetailContext {
    candidate_id: string;
    round: string;
    stage: string;
    previousView: ViewState;
}

const CompetitionWrapper: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [selectedExamTitle, setSelectedExamTitle] = useState<string>('League - Round 1');
  const [detailContext, setDetailContext] = useState<DetailContext | null>(null);

  const handleViewStandings = (id?: string, title?: string) => {
    if (title) setSelectedExamTitle(title);
    setView('standings');
  };

  const handleViewCandidateDetails = (candidate_id: string, stage: string, round: string) => {
    setDetailContext({
        candidate_id,
        stage,
        round,
        previousView: currentView
    });
    setView('candidate-details');
  };

  return (
    <div className="w-full">
      {currentView === 'dashboard' && (
        <CompetitionDashboard 
          onViewFullLeaderboard={() => setView('leaderboard')}
          onViewFullStandings={() => handleViewStandings()}
          onViewStandings={handleViewStandings}
        />
      )}

      {currentView === 'leaderboard' && (
        <div className="p-4 sm:p-8">
          <FullLeagueLeaderboard 
            onBack={() => setView('dashboard')} 
            onViewDetails={(id) => handleViewCandidateDetails(id, 'League', '3')} // Assuming League R3 for now
          />
        </div>
      )}

      {currentView === 'standings' && (
        <div className="p-4 sm:p-8">
          <FullStandings 
            onBack={() => setView('dashboard')} 
            examTitle={selectedExamTitle}
            onViewDetails={(id) => handleViewCandidateDetails(id, 'League', '1')} // Placeholder round/stage
          />
        </div>
      )}

      {currentView === 'candidate-details' && detailContext && (
        <div className="p-4 sm:p-8">
          <ViewCandidateDetails 
            candidate_id={detailContext.candidate_id}
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
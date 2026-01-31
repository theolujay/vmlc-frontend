import React, { useState } from 'react';
import CompetitionDashboard from './CompetitionDashboard';
import FullLeagueLeaderboard from './FullLeagueLeaderboard';
import FullStandings from './FullStandings';

type ViewState = 'dashboard' | 'leaderboard' | 'standings';

const CompetitionWrapper: React.FC = () => {
  const [currentView, setView] = useState<ViewState>('dashboard');
  const [selectedExamTitle, setSelectedExamTitle] = useState<string>('League - Round 1');

  const handleViewStandings = (id?: string, title?: string) => {
    if (title) setSelectedExamTitle(title);
    setView('standings');
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
        <div className="p-4 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <FullLeagueLeaderboard onBack={() => setView('dashboard')} />
        </div>
      )}

      {currentView === 'standings' && (
        <div className="p-4 sm:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <FullStandings 
            onBack={() => setView('dashboard')} 
            examTitle={selectedExamTitle}
          />
        </div>
      )}
    </div>
  );
};

export default CompetitionWrapper;

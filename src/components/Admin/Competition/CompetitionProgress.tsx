import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';

export enum CompetitionStage {
  SCREENING = 'Screening',
  LEAGUE = 'League',
  FINAL = 'Final'
}

interface StageItemProps {
  stage: string;
  activeStage: string;
  completed: boolean;
  subLabel?: string;
}

const StageItem: React.FC<StageItemProps> = ({ stage, activeStage, completed, subLabel }) => {
  const isActive = stage === activeStage;
  const isCompleted = completed;

  return (
    <div className="flex flex-col items-center z-10 bg-white px-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-1 transition-all duration-300 ${
        isCompleted ? 'bg-[#EBEBF5] border-[#3E4095] text-[#3E4095]' : 
        isActive ? 'bg-[#EBEBF5] border-[#3E4095] text-[#3E4095]' : 
        'bg-white border-[#F0F2F5] text-[#98A2B3]'
      }`}>
        {isCompleted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="font-bold text-sm">{stage.charAt(0)}</span>
        )}
      </div>
      <div className="mt-2 text-center">
        <p className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-[#3E4095]' : isActive ? 'text-[#3E4095]' : 'text-[#98A2B3]'}`}>{stage}</p>
        {subLabel && <p className="text-[9px] text-[#667185] font-medium uppercase mt-0.5">{subLabel}</p>}
      </div>
    </div>
  );
};

interface StageBoardProps {
  currentStage: string;
  leagueStatus: {
    currentRound: number;
    totalRounds: number;
    publishedRounds: number;
  };
}

const StageBoard: React.FC<StageBoardProps> = ({ currentStage, leagueStatus }) => {
  const getStageStatus = (stage: CompetitionStage) => {
    const stages = [CompetitionStage.SCREENING, CompetitionStage.LEAGUE, CompetitionStage.FINAL];
    const currentIndex = stages.indexOf(currentStage as CompetitionStage);
    const stageIndex = stages.indexOf(stage);

    if (currentIndex === -1) return false; 
    return currentIndex > stageIndex;
  };

  return (
    <ResponsiveContainer className="flex flex-col gap-6 font-sans">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest">Competition Progress</h2>
        {/* <span className="text-[8px] text-[#3E4095] font-bold border border-[#3E4095]/50 px-1 py-0.5 rounded uppercase">Current Stage</span> */}
      </div>

      <div className="flex items-center justify-between relative px-4">
        <div className="absolute top-[20px] left-0 w-full h-[1px] bg-[#3E4095]/20 z-0"></div>
        
        <StageItem 
          stage={CompetitionStage.SCREENING} 
          activeStage={currentStage} 
          completed={getStageStatus(CompetitionStage.SCREENING)} 
        />
        <StageItem 
          stage={CompetitionStage.LEAGUE} 
          activeStage={currentStage} 
          // subLabel={currentStage === CompetitionStage.LEAGUE ? `Round ${leagueStatus.currentRound} of ${leagueStatus.totalRounds}` : undefined}
          completed={getStageStatus(CompetitionStage.LEAGUE)} 
        />
        <StageItem 
          stage={CompetitionStage.FINAL} 
          activeStage={currentStage} 
          completed={getStageStatus(CompetitionStage.FINAL)} 
        />
      </div>

      {/* Admin Specific: Detailed League Progress */}
      {currentStage === CompetitionStage.LEAGUE && (
        <div className="mt-2 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between gap-1 mb-4">
            <h3 className="pl-1 text-[10px] font-bold text-[#475367] tracking-wider">Rounds</h3>
             {/* <span className="text-[9px] text-[#667185] italic">(● = published, ○ = pending)</span> */}
          </div>
          
          <div className="flex items-center justify-between gap-0 overflow-x-auto pb-4 px-2">
            {Array.from({ length: leagueStatus.totalRounds }).map((_, idx) => {
              const roundNum = idx + 1;
              const isPublished = roundNum <= leagueStatus.publishedRounds;
              const isCurrent = roundNum === leagueStatus.currentRound;
              const isPast = roundNum < leagueStatus.currentRound;

              return (
                <React.Fragment key={roundNum}>
                  {/* 1. Dot Container */}
                  <div className="flex flex-col items-center">
                    <span className={`text-[9px] font-bold mb-1.5 ${isPublished || isCurrent ? 'text-[#3E4095]' : 'text-[#98A2B3]'}`}>
                      W{roundNum}
                    </span>
                    <div className={`
                      w-2.5 h-2.5 rounded-full border 
                      ${isPublished ? 'bg-[#3E4095] border-[#3E4095]' : 
                        isCurrent ? 'bg-white border-[#3E4095] animate-pulse ring-2 ring-[#3E4095]/20' : 
                        'bg-white border-[#D0D5DD]'}
                    `}></div>
                  </div>

                  {/* 2. Flexible Connector Line */}
                  {roundNum < leagueStatus.totalRounds && (
                    <div className="flex-1 flex items-center justify-center px-0.5">
                      <div className={`w-full h-[1px] mt-[16px] ${isPast ? 'bg-[#3E4095]' : 'bg-[#E4E7EC]'}`}></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default StageBoard;

import React from 'react';

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
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
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

interface StageProgressProps {
  currentStage: string;
  leagueWeek?: number;
}

const StageProgress: React.FC<StageProgressProps> = ({ currentStage, leagueWeek }) => {
  const getStageStatus = (stage: CompetitionStage) => {
    const stages = [CompetitionStage.SCREENING, CompetitionStage.LEAGUE, CompetitionStage.FINAL];
    const currentIndex = stages.indexOf(currentStage as CompetitionStage);
    const stageIndex = stages.indexOf(stage);

    if (currentIndex === -1) return false; 
    return currentIndex > stageIndex;
  };

  return (
    <section className="bg-white p-6 rounded-[24px] border border-[#E4E7EC] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest">Competition Progress</h2>
        <span className="text-[8px] text-[#3E4095] font-bold border border-[#3E4095] px-2 py-0.5 rounded uppercase">Current Stage</span>
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
          subLabel={currentStage === CompetitionStage.LEAGUE && leagueWeek ? `Week ${leagueWeek} of 6` : undefined}
          completed={getStageStatus(CompetitionStage.LEAGUE)} 
        />
        <StageItem 
          stage={CompetitionStage.FINAL} 
          activeStage={currentStage} 
          completed={getStageStatus(CompetitionStage.FINAL)} 
        />
      </div>
    </section>
  );
};

export default StageProgress;

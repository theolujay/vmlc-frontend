import React from 'react';

export enum CompetitionStage {
  SCREENING = 'Screening',
  LEAGUE = 'League',
  FINAL = 'Final'
}

interface StageBoardProps {
  currentStage: string;
  leagueStatus: {
    currentRound: number;
    totalRounds: number;
    publishedRounds: number;
  };
}

const StageBoard: React.FC<StageBoardProps> = ({ currentStage, leagueStatus }) => {
  const stages = [CompetitionStage.SCREENING, CompetitionStage.LEAGUE, CompetitionStage.FINAL];
  const currentStageIndex = stages.indexOf(currentStage as CompetitionStage);

  const getStageState = (stage: CompetitionStage) => {
    const index = stages.indexOf(stage);
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white border border-[#E4E7EC] rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
         <span className="text-xs font-bold text-[#475367] uppercase tracking-widest">Stage Board</span>
         <span className="text-xs text-[#667185]">(Read-only orientation)</span>
      </div>

      {/* Macro Stages */}
      <div className="flex items-center justify-between relative px-4 py-4">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#F2F4F7] -z-0"></div>
        
        {stages.map((stage) => {
          const state = getStageState(stage);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          
          return (
            <div key={stage} className="flex flex-col items-center z-10 bg-white px-4">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${isCompleted ? 'bg-[#EBEBF5] border-[#3E4095] text-[#3E4095]' : 
                  isActive ? 'bg-[#3E4095] border-[#3E4095] text-white' : 
                  'bg-white border-[#F0F2F5] text-[#D0D5DD]'}
              `}>
                {isCompleted ? (
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                ) : (
                  <span className="text-[10px] font-bold">
                    {isActive ? '●' : '○'}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                 <span className={`text-xs font-bold uppercase tracking-wide ${isActive || isCompleted ? 'text-[#3E4095]' : 'text-[#98A2B3]'}`}>
                   [{stage}]
                 </span>
                 <p className="text-[10px] text-[#667185] font-medium mt-0.5">
                   {state === 'completed' ? 'Completed' : 
                    state === 'active' ? (stage === CompetitionStage.LEAGUE ? `Active (Round ${leagueStatus.currentRound}/${leagueStatus.totalRounds})` : 'Active') : 
                    'Pending'}
                 </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* League Micro Progress */}
      {currentStage === CompetitionStage.LEAGUE && (
        <div className="mt-4 p-4 bg-[#F9FAFB] rounded-lg border border-[#F2F4F7]">
          <h3 className="text-xs font-semibold text-[#475467] mb-4 uppercase">Stage Progress (League)</h3>
          
          <div className="flex items-center justify-start gap-0 overflow-x-auto pb-2">
            {Array.from({ length: leagueStatus.totalRounds }).map((_, idx) => {
              const roundNum = idx + 1;
              const isPublished = roundNum <= leagueStatus.publishedRounds;
              const isCurrent = roundNum === leagueStatus.currentRound;
              const isPast = roundNum < leagueStatus.currentRound;

              return (
                <div key={roundNum} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-[10px] font-bold mb-1 ${isPublished || isCurrent ? 'text-[#3E4095]' : 'text-[#98A2B3]'}`}>
                      R{roundNum}
                    </span>
                    <div className={`
                      w-3 h-3 rounded-full border 
                      ${isPublished ? 'bg-[#3E4095] border-[#3E4095]' : 
                        isCurrent ? 'bg-white border-[#3E4095] animate-pulse' : 
                        'bg-white border-[#D0D5DD]'}
                    `}></div>
                  </div>
                  {/* Connector Line */}
                  {roundNum < leagueStatus.totalRounds && (
                    <div className={`w-12 h-[1px] mt-[14px] mx-1 ${isPast ? 'bg-[#3E4095]' : 'bg-[#E4E7EC]'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[10px] text-[#667185] italic">
             (● = published standings, ○ = pending/draft)
          </div>
        </div>
      )}
    </div>
  );
};

export default StageBoard;

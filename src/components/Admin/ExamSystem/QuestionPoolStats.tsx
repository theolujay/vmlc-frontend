import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import clsx from 'clsx';

interface QuestionPoolStatsProps {
  stats: {
    total: number;
    easy: number;
    moderate: number;
    hard: number;
  };
  activeDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  title?: string;
  headerLabel?: string;
}

const QuestionPoolStats: React.FC<QuestionPoolStatsProps> = ({ 
  stats, 
  activeDifficulty, 
  onDifficultyChange,
  title,
  headerLabel = "Question Repository"
}) => {
  const statItems = [
    {
      key: 'total',
      label: 'TOTAL POOL',
      value: stats.total,
      icon: 'fa-database',
      color: 'text-[#3E4095]',
      bg: 'bg-[#3E4095]/5'
    },
    {
      key: 'easy',
      label: 'EASY LEVEL',
      value: stats.easy,
      icon: 'fa-leaf',
      color: 'text-[#099137]',
      bg: 'bg-[#099137]/5'
    },
    {
      key: 'moderate',
      label: 'MODERATE LEVEL',
      value: stats.moderate,
      icon: 'fa-balance-scale',
      color: 'text-[#AD6F07]',
      bg: 'bg-[#AD6F07]/5'
    },
    {
      key: 'hard',
      label: 'HARD LEVEL',
      value: stats.hard,
      icon: 'fa-fire',
      color: 'text-[#CB1A14]',
      bg: 'bg-[#CB1A14]/5'
    }
  ];

  return (
    <ResponsiveContainer className="font-sans flex flex-col gap-4">
      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
        <h1 className="text-xl font-bold text-[#101828] uppercase tracking-tight">{title}</h1>
        <div className="flex items-center gap-2">
          <i className="fas fa-database text-[#3E4095] text-[10px]"></i>
          <h2 className="text-[10px] text-[#475367] font-bold uppercase tracking-widest">{headerLabel}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((item) => {
          const isActive = activeDifficulty === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onDifficultyChange(item.key)}
              className={clsx(
                "flex flex-col gap-2 p-4 rounded-xl transition-all text-left group border",
                isActive 
                  ? "bg-[#3E4095] border-[#3E4095] shadow-lg shadow-[#3E4095]/20" 
                  : "bg-gray-50 border-gray-50 hover:border-gray-200"
              )}
            >
              <div className="flex gap-2 items-center">
                <div className={clsx(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-white/10 text-white" : `${item.bg} ${item.color}`
                )}>
                  <i className={clsx("fas", item.icon, "text-xs")}></i>
                </div>
                <p className={clsx(
                  "text-[9px] font-black uppercase tracking-widest",
                  isActive ? "text-white/70" : "text-gray-400"
                )}>
                  {item.label}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <span className={clsx(
                  "font-bold text-2xl tracking-tight",
                  isActive ? "text-white" : "text-gray-800"
                )}>
                  {item.value.toLocaleString()}
                </span>
                {isActive && (
                  <span className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">
                    Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ResponsiveContainer>
  );
};

export default QuestionPoolStats;

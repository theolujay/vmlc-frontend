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
  // headerLabel = ""
}) => {
  const statItems = [
    {
      key: 'total',
      label: 'TOTAL QUESTIONS',
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
    <ResponsiveContainer className="font-sans flex flex-col gap-5 p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-5 bg-[#3E4095] rounded-full"></div>
          <h1 className="text-lg font-black text-gray-800 tracking-tight uppercase">{title}</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
          <i className="fas fa-filter text-[#3E4095] text-[10px]"></i>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Filter By Difficulty</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const isActive = activeDifficulty === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onDifficultyChange(item.key)}
              className={clsx(
                "flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300 text-left group border cursor-pointer relative overflow-hidden",
                isActive 
                  ? "bg-[#3E4095] border-[#3E4095] shadow-lg shadow-[#3E4095]/20 scale-[1.02]" 
                  : "bg-gray-50/50 border-gray-50 hover:bg-white hover:border-[#3E4095]/20 hover:shadow-md hover:shadow-[#3E4095]/5"
              )}
            >
              {isActive && (
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
              )}
              
              <div className="flex gap-3 items-center">
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm",
                  isActive ? "bg-white text-[#3E4095]" : `${item.bg} ${item.color} group-hover:scale-110`
                )}>
                  <i className={clsx("fas", item.icon, "text-sm")}></i>
                </div>
                <p className={clsx(
                  "text-[9px] font-black uppercase tracking-[0.15em]",
                  isActive ? "text-white/80" : "text-gray-400"
                )}>
                  {item.label}
                </p>
              </div>
              
              <div className="flex items-end justify-between mt-1">
                <span className={clsx(
                  "font-black text-3xl tracking-tight leading-none",
                  isActive ? "text-white" : "text-gray-900"
                )}>
                  {item.value.toLocaleString()}
                </span>
                {isActive ? (
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <i className="fas fa-check text-white text-[10px]"></i>
                  </div>
                ) : (
                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-chevron-right text-gray-400 text-[8px]"></i>
                  </div>
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

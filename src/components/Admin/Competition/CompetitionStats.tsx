import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { RegisteredIcon, CandidateIcon, InactiveIcon } from '../AdminIcons';

interface CompetitionStatsProps {
  candidatesStats: {
    enrolled: number;
    active: number;
    eliminated: number;
  };
}

const CompetitionStats: React.FC<CompetitionStatsProps> = ({ candidatesStats }) => {
  const candidatesStatItems = [
    {
      icon: <RegisteredIcon />,
      label: 'ENROLLED',
      value: candidatesStats.enrolled,
      color: 'text-gray-800'
    },
    {
      icon: <CandidateIcon />,
      label: 'ACTIVE',
      value: candidatesStats.active,
      color: 'text-[#039855]'
    },
    {
      icon: <InactiveIcon />,
      label: 'ELIMINATED',
      value: candidatesStats.eliminated,
      color: 'text-[#D92D20]'
    }
  ];

  return (
    <ResponsiveContainer className="font-sans flex flex-col gap-4">
       <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
            <h1 className="text-xl font-bold text-[#101828]">Verboheit MLC 3.0</h1>
            <h2 className="text-[10px] text-[#475367] font-bold px-2 py-0.5 uppercase tracking-widest">Candidates</h2>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {candidatesStatItems.map((stat, index) => (
          <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2 items-center">
              <span className="flex-shrink-0 opacity-70 scale-90">{stat.icon}</span>
              <p className="text-xs font-medium text-gray-700 leading-tight">{stat.label}</p>
            </div>
            <span className={`font-bold text-xl ${stat.color}`}>{stat.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </ResponsiveContainer>
  );
};

export default CompetitionStats;

import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { InactiveIcon, UserManagementIcon, ActiveIcon } from '../AdminIcons';

interface CompetitionStatsProps {
  candidatesStats: {
    enrolled: number;
    active: number;
    eliminated: number;
    disqualified: number;
  };
}

const CompetitionStats: React.FC<CompetitionStatsProps> = ({ candidatesStats }) => {
  const candidatesStatItems = [
    {
      icon: <UserManagementIcon />,
      label: 'ENROLLED',
      value: candidatesStats.enrolled,
      color: 'text-[#3E4095]'
    },
    {
      icon: <ActiveIcon />,
      label: 'ACTIVE',
      value: candidatesStats.active,
      color: 'text-[#039855]'
    },
    {
      icon: <InactiveIcon />,
      label: 'ELIMINATED',
      value: candidatesStats.eliminated,
      color: 'text-[#D92D20]'
    },
    {
      icon: <InactiveIcon />,
      label: 'DISQUALIFIED',
      value: candidatesStats.disqualified,
      color: 'text-gray-800'
    }
  ];

  return (
    <ResponsiveContainer className="font-sans flex flex-col gap-4">
       <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
            <h1 className="text-xl font-bold text-[#101828]">Verboheit MLC 3.0</h1>
            <h2 className="text-[10px] text-[#475367] font-bold px-2 py-0.5 uppercase tracking-widest">Candidates</h2>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {candidatesStatItems.map((stat, index) => (
          <div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2 items-center">
              <span className={`flex-shrink-0 opacity-70 scale-90 ${stat.color}`}>{stat.icon}</span>
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

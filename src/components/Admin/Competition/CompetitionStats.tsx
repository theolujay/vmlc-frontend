import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { InactiveIcon, UserManagementIcon, ActiveIcon } from '../AdminIcons';

interface CompetitionStatsProps {
  candidatesStats: {
    enrolled: number;
    active: number;
    eliminated: number;
    disqualified: number;
    stage_breakdown: Record<string, number>;
  };
}

const CompetitionStats: React.FC<CompetitionStatsProps> = ({ candidatesStats }) => {
  const candidatesStatItems = [
    {
      icon: <UserManagementIcon />,
      label: 'ENROLLED',
      title: 'Candidates enrolled in the current VMLC edition.',
      value: candidatesStats.enrolled,
      color: 'text-[#3E4095]'
    },
    {
      icon: <ActiveIcon />,
      label: 'ACTIVE',
      title: `Active distribution: ${Object.entries(candidatesStats.stage_breakdown || {})
        .filter(([, count]) => count > 0)
        .map(([stage, count]) => `${stage.charAt(0).toUpperCase() + stage.slice(1)} (${count})`)
        .join(', ') || 'No active candidates'}`,
      value: candidatesStats.active,
      color: 'text-[#039855]'
    },
    {
      icon: <InactiveIcon />,
      label: 'ELIMINATED',
      title: 'Candidates who have been eliminated so far in the competition. E.g. During screening, league or final.',
      value: candidatesStats.eliminated,
      color: 'text-[#D92D20]'
    },
    {
      icon: <InactiveIcon />,
      label: 'DISQUALIFIED',
      title: 'Candidates who have been forcibly removed from the competition. E.g. due to violation.',
      value: candidatesStats.disqualified,
      color: 'text-gray-800'
    }
  ];

  return (
    <ResponsiveContainer className="font-sans flex flex-col gap-4">
       <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
            <h1 className="text-xl font-bold text-[#101828] tracking-wide">Verboheit Mathematics League Competition 3.0</h1>
            <h2 className="text-[10px] text-[#475367] font-bold px-2 py-0.5 uppercase tracking-widest">Candidate Stats</h2>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {candidatesStatItems.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg cursor-help transition-all hover:bg-gray-100 group"
            title={stat.title}
          >
            <div className="flex gap-2 items-center">
              <span className={`flex-shrink-0 opacity-70 scale-90 ${stat.color} transition-transform group-hover:scale-100`}>{stat.icon}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
            </div>
            <span className={`font-bold text-xl ${stat.color}`}>{stat.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </ResponsiveContainer>
  );
};

export default CompetitionStats;

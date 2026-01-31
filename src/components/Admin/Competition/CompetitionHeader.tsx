import React from 'react';
import { RegisteredIcon, ActiveIcon, InactiveIcon, CandidateIcon } from '../AdminIcons';

interface CompetitionStats {
  enrolled: number;
  active: number;
  eliminated: number;
  awaiting: number;
}

interface CompetitionHeaderProps {
  stats: CompetitionStats;
  globalStatus: string;
}

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ stats, globalStatus }) => {
  return (
    <div className="w-full flex flex-col gap-0 border border-[#E4E7EC] rounded-xl overflow-hidden shadow-sm">
      {/* Top Bar: Title & Status */}
      <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-[#E4E7EC]">
        <h1 className="text-xl font-bold text-[#101828]">VMLC 3.0</h1>
        <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-[#475467]">Status:</span>
           <span className="px-2.5 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054] text-sm font-semibold border border-[#D0D5DD]">
             {globalStatus}
           </span>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 bg-[#F9FAFB] px-6 py-3 text-sm text-[#475467]">
        <div className="flex items-center gap-2">
          <RegisteredIcon className="w-4 h-4 text-[#667185]" />
          <span className="font-medium">Enrolled: {stats.enrolled.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <ActiveIcon className="w-4 h-4 text-[#039855]" />
          <span className="font-medium">Active: {stats.active.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <InactiveIcon className="w-4 h-4 text-[#D92D20]" />
          <span className="font-medium">Eliminated: {stats.eliminated.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <CandidateIcon className="w-4 h-4 text-[#DC6803]" />
          <span className="font-medium">Awaiting Next Challenge: {stats.awaiting.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CompetitionHeader;

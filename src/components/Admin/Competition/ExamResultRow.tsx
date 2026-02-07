import React from 'react';

export type CompetitionExam = {
  id: string;
  title: string;
  status: 'scheduled' | 'ongoing' | 'concluded';
  ranking_status: 'pending'| 'ready' | 'published';
  stats?: {
    candidates_sat: number;
    avg_score?: number;
    absent?: number;
  };
};

interface ExamResultRowProps {
  exam: CompetitionExam;
  onView: (id: string) => void;
  canInteract?: boolean;
}

const ExamResultRow: React.FC<ExamResultRowProps> = ({ exam, onView, canInteract = true }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-white text-green-500 border-green-100';
      case 'ongoing': return 'bg-white text-red-500 border-red-100';
      case 'concluded': return 'bg-white text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const canView = exam.ranking_status === 'published' && canInteract;

  return (
    <div className={`border border-[#E4E7EC] rounded-lg p-4 bg-white transition-colors group font-sans ${canInteract ? 'hover:border-[#3E4095]' : ''}`}>
      <div className="flex justify-between items-center">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#101828] text-sm">{exam.title}</h3>
            <span className={`text-[7px] font-medium px-1 py-0.5 rounded border uppercase ${getStatusColor(exam.status)}`}>
              {exam.status}
            </span>
          </div>

          <div className="pl-0 text-sm text-[#475467] space-y-1">
            {exam.stats ? (
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span>Candidates sat: <strong className="text-[#101828]">{exam.stats.candidates_sat.toLocaleString()}</strong></span>
                {exam.stats.avg_score !== undefined && (
                  <>
                     <span className="text-gray-300">|</span>
                     <span>Avg: <strong className="text-[#101828]">{exam.stats.avg_score}</strong></span>
                  </>
                )}
                {exam.stats.absent !== undefined && (
                   <>
                    <span className="text-gray-300">|</span>
                    <span>Absent: <strong className="text-[#101828]">{exam.stats.absent}</strong></span>
                   </>
                )}
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  Ranking: 
                  <span className={`font-medium ${exam.ranking_status === 'published' ? 'text-[#3E4095]' : 'text-black-100'}`}>
                    {exam.ranking_status === 'published' ? 'Published' : exam.ranking_status === 'ready' ? 'Ready' : 'Pending'}
                  </span>
                </span>
              </div>
            ) : (
               <p className="text-xs text-gray-400 italic">No statistics available yet.</p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
           {canView && (
             <button 
               onClick={() => onView(exam.id)}
               className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-full hover:bg-[#3E4095] hover:text-[#FFFFFF]"
             >
               View
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultRow;
import React from 'react';

export type CompetitionExam = {
  id: string;
  title: string;
  stage: string;
  round: number;
  status: 'scheduled' | 'ongoing' | 'concluded';
  ranking_status: 'pending'| 'ready' | 'published';
  stats?: {
    candidates_sat: number;
    eligible_candidates: number;
    participation_rate: number;
    avg_score: number;
    highest_score: number;
    lowest_score: number;
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

  const canView = (exam.ranking_status === 'published' ||  exam.ranking_status === 'ready') && canInteract;

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
              <div className="flex flex-col md:flex-row md:flex-wrap gap-x-3 gap-y-1 text-[10px]">
                <div className="flex gap-1">
                    <span className="text-gray-800">Candidates sat:</span>
                    <span className="text-[#101828] font-bold">{exam.stats.candidates_sat.toLocaleString()}</span>
                    <span className="text-gray-400">({exam.stats.participation_rate}%)</span>
                    <span className="text-gray-300 hidden md:inline">|</span>
                </div>
                <div className="flex gap-1">
                    <span className="text-gray-400">Score (%) → </span>
                    <span className="text-[#101828]">Avg: </span>
                    <span className="text-[#101828]">
                      <span className="font-bold">{exam.stats.avg_score}</span>,
                    </span>
                    <span className="text-[#101828]">Range:</span>
                    <span className="text-[#101828] font-bold">{exam.stats.highest_score}</span>
                    <span className="text-gray-600"> — </span>
                    <span className="text-[#101828] font-bold">{exam.stats.lowest_score}</span>
                    <span className="text-gray-300 hidden md:inline">|</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="text-gray-400">Ranking:</span>
                  <span className={`font-black uppercase tracking-widest text-[8px] ${exam.ranking_status === 'published' ? 'text-emerald-600' : exam.ranking_status === 'ready' ? 'text-amber-600' : 'text-gray-400'}`}>
                    {exam.ranking_status}
                  </span>
                </div>
              </div>
            ) : (
               <p className="text-[10px] text-gray-400 italic">No analytics available yet.</p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
           {canView && (
             <button
               onClick={() => onView(exam.id)}
               className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#344054] bg-white border border-[#D0D5DD] rounded-full hover:bg-[#3E4095] hover:text-[#FFFFFF] hover:cursor-pointer transition-all active:scale-95"
             >
               View <span className="hidden md:inline lg:inline">Details</span>
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultRow;

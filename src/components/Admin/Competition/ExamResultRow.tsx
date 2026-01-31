import React from 'react';
import { SortIcon, DownloadIcon, AnnouncementIcon, ActivitiesIcon } from '../AdminIcons';

export type CompetitionExam = {
  id: string;
  title: string;
  stage: string;
  status: 'draft' | 'active' | 'completed' | 'concluded';
  standings_status: 'none' | 'draft' | 'published';
  stats?: {
    candidates_sat: number;
    avg_score?: number;
    absent?: number;
  };
  actions: {
    can_generate: boolean;
    can_publish: boolean;
    can_view: boolean;
    can_edit: boolean;
  }
};

interface ExamResultRowProps {
  exam: CompetitionExam;
  onView: (id: string) => void;
  onGenerate: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string) => void;
}

const ExamResultRow: React.FC<ExamResultRowProps> = ({ exam, onView, onGenerate, onPublish, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'concluded': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="border border-[#E4E7EC] rounded-lg p-4 bg-white hover:border-[#3E4095] transition-colors group">
      <div className="flex justify-between items-start">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-[#101828] text-sm">{exam.title}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border uppercase ${getStatusColor(exam.status)}`}>
              {exam.status}
            </span>
          </div>

          <div className="pl-0 text-sm text-[#475467] space-y-1">
            {exam.stats ? (
              <div className="flex flex-wrap gap-4 text-xs">
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
                  Standings: 
                  <span className={`font-medium ${exam.standings_status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                    {exam.standings_status === 'published' ? 'Published' : exam.standings_status === 'draft' ? 'Draft' : 'Not generated'}
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
           {exam.actions.can_view && (
             <button 
               onClick={() => onView(exam.id)}
               className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded hover:bg-[#F9FAFB]"
             >
               <ActivitiesIcon className="w-3 h-3" />
               View
             </button>
           )}

           {exam.actions.can_edit && (
             <button 
                onClick={() => onEdit(exam.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded hover:bg-[#F9FAFB]"
             >
               Edit Exam
             </button>
           )}

           {exam.actions.can_generate && (
             <button 
               onClick={() => onGenerate(exam.id)}
               className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#026AA2] bg-[#F0F9FF] border border-[#B9E6FE] rounded hover:bg-[#E0F2FE]"
             >
               <DownloadIcon className="w-3 h-3" />
               Generate
             </button>
           )}

           {exam.actions.can_publish && (
             <button 
               onClick={() => onPublish(exam.id)}
               className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#3E4095] border border-[#3E4095] rounded hover:bg-[#353885]"
             >
               <AnnouncementIcon className="w-3 h-3" />
               Publish
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default ExamResultRow;

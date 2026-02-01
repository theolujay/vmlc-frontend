import React from 'react';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import ExamResultRow, { CompetitionExam } from './ExamResultRow';

interface ExamStatusProps {
  exams: CompetitionExam[];
  onView: (id: string) => void;
  onGenerate: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string) => void;
  canInteract?: boolean;
}

const ExamStatus: React.FC<ExamStatusProps> = ({ exams, onView, canInteract = true }) => {
  return (
    <ResponsiveContainer className="flex flex-col gap-4 font-sans">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest">Exam Status</h2>
        {/* <span className="text-xs text-[#667185] font-normal">(Select exam to view details)</span> */}
      </div>
      
      <div className="flex flex-col gap-3">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <ExamResultRow 
              key={exam.id} 
              exam={exam}
              onView={onView}
              canInteract={canInteract}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
            No upcoming or concluded exams yet.
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default ExamStatus;
import React from 'react';
import ExamResultRow, { CompetitionExam } from './ExamResultRow';

interface ResultsListProps {
  exams: CompetitionExam[];
  onView: (id: string) => void;
  onGenerate: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ exams, onView, onGenerate, onPublish, onEdit }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-[#475367] uppercase tracking-widest">Available Results</h2>
        <span className="text-xs text-[#667185] font-normal">(Select exam to view details)</span>
      </div>
      
      <div className="flex flex-col gap-3">
        {exams.length > 0 ? (
          exams.map((exam) => (
            <ExamResultRow 
              key={exam.id} 
              exam={exam} 
              onView={onView}
              onGenerate={onGenerate}
              onPublish={onPublish}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
            No exams available for the current stage.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsList;

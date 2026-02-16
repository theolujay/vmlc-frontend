import React from 'react';

interface ExamRecord {
  exam: string;
  score: number | null;
  percentage: number | null;
  date: Date;
  exam_stage: string;
  isPublished?: boolean;
}

interface ExamHistoryProps {
  history: ExamRecord[];
}

const getScoreStatus = (score: number | null, isPublished?: boolean) => {
  if (!isPublished || score === null) return { label: 'Awaiting Results', color: 'text-[#667185]' };
  if (score > 75) return { label: 'Excellent', color: 'text-[#0F973D]' }; // Green
  if (score > 60) return { label: 'Great', color: 'text-[#70AD47]' };    // Light Green
  if (score > 50) return { label: 'Good', color: 'text-[#EAB308]' };     // Golden/Yellow
  if (score >= 35) return { label: 'Fair', color: 'text-[#F97316]' };    // Orange
  return { label: 'Poor', color: 'text-[#CB1A14]' };                    // Red
};

const ExamHistory: React.FC<ExamHistoryProps> = ({ history }) => {
  return (
    <section className="bg-white p-6 rounded-[24px] border border-[#E4E7EC] shadow-sm h-[300px] flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xs font-bold text-[#475367] uppercase tracking-widest">Your Results</h2>
        <span className="text-[10px] text-[#667185] font-medium uppercase">Scores</span>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto pr-2">
        {history.length === 0 ? (
          <div className="text-center py-12 text-[#98A2B3] text-sm italic">
            No exams taken yet.
          </div>
        ) : (
          <div className="divide-y divide-[#F0F2F5]">
            {history.map((record, index) => {

              const { label, color } = getScoreStatus(record.score ?? record.score, record.isPublished);
              const displayScore = record.isPublished && record.score !== null ? `${record.score}%` : '--';

              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0 hover:bg-[#F9FAFB] transition-colors px-2 -mx-2 rounded-lg group"
                >
                  {/* Left: Exam Info */}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold text-[#101828]">
                      {record.exam}
                    </p>
                    <p className="text-[10px] text-[#667185] uppercase tracking-tighter">
                      {record.date
                        ? new Date(record.date).toLocaleDateString('en-UK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Right: Score and Badge */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#101828] leading-none mb-1">
                        {displayScore}
                      </p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${color}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExamHistory;
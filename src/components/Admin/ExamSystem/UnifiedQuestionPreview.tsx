'use client';

import React from 'react';
import MathRenderer from '@/components/Exam/MathRenderer';
import { QuestionData } from '@/types/question';

interface UnifiedQuestionPreviewProps {
  data: QuestionData;
  correctOptionId?: string;
}

const UnifiedQuestionPreview: React.FC<UnifiedQuestionPreviewProps> = ({
  data,
  correctOptionId
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Student View Header */}
      <div className="bg-[#3E4095] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Student View Mode</span>
        </div>
        <div className="px-3 py-1 bg-white/10 rounded-full">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Question Preview</span>
        </div>
      </div>

      <div className="p-10 space-y-10">
        {/* Question Text */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
             <span className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest">Problem</span>
             <div className="h-px flex-1 bg-gray-50"></div>
          </div>
          <div className="text-xl text-gray-800 leading-relaxed font-medium">
            <MathRenderer content={data.questionText || '<span class="text-gray-300 italic">No question text provided...</span>'} />
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.options.map((option) => (
            <div 
              key={option.id}
              className={`p-6 rounded-2xl border-2 transition-all flex items-start space-x-4 ${
                correctOptionId === option.id 
                ? 'border-[#3E4095] bg-[#3E4095]/5 shadow-md' 
                : 'border-gray-50 bg-gray-50/50'
              }`}
            >
              <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm border-2 ${
                 correctOptionId === option.id
                 ? 'bg-[#3E4095] text-white border-[#3E4095]'
                 : 'bg-white text-gray-400 border-gray-100'
              }`}>
                {String.fromCharCode(64 + parseInt(option.id))}
              </div>
              <div className="pt-2 text-gray-700 font-medium">
                <MathRenderer 
                    content={option.text || '<span class="text-gray-300 italic">Empty option</span>'} 
                    inline
                />
              </div>
              {correctOptionId === option.id && (
                <div className="ml-auto">
                    <i className="fas fa-check-circle text-[#3E4095]"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Metadata Bar */}
        <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                data.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                data.difficulty === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                'bg-red-50 text-red-600'
              }`}>
                Difficulty: {data.difficulty}
              </span>
           </div>
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              VMLC Exam System • Standard MCQ
           </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedQuestionPreview;

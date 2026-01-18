import React from 'react';
import MathRenderer from '@/components/Exam/MathRenderer';

interface MathPreviewProps {
  content: string;
  className?: string;
}

const MathPreview: React.FC<MathPreviewProps> = ({ content, className = "" }) => {
  return (
    <div className={`p-3 bg-[#3E4095]/5 border border-[#3E4095]/10 rounded-md text-sm italic min-h-[3rem] ${className}`}>
        <MathRenderer content={content || "_No content preview available_"} />
    </div>
  );
};

export default MathPreview;

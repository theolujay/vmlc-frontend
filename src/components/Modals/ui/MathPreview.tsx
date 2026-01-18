import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathPreviewProps {
  content: string;
  className?: string;
}

const MathPreview: React.FC<MathPreviewProps> = ({ content, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Find all segments of math (between $...$ or $$...$$)
      // This is a simple implementation; a more robust one might use a markdown-to-katex library
      const processContent = (text: string) => {
        // Simple regex to match $...$ and $$...$$
        // We'll replace them with spans that KaTeX will render into
        let html = text.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true, throwOnError: false });
          } catch (e) {
            return match;
          }
        });
        
        html = html.replace(/\$(.*?)\$/g, (match, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: false, throwOnError: false });
          } catch (e) {
            return match;
          }
        });

        // Replace newlines with breaks for standard text
        return html.replace(/\n/g, '<br/>');
      };

      containerRef.current.innerHTML = processContent(content || "_No content preview available_");
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`p-3 bg-[#3E4095]/5 border border-[#3E4095]/10 rounded-md text-sm italic text-gray-700 min-h-[3rem] ${className}`}
    />
  );
};

export default MathPreview;

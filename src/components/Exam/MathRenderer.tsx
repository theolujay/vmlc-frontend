'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import renderMathInElement from 'katex/contrib/auto-render';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "", inline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize whether the content contains HTML to avoid re-calculating on every render
  const hasHtml = useMemo(() => /<[a-z][\s\S]*>/i.test(content || ''), [content]);

  useEffect(() => {
    if (containerRef.current) {
      try {
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
          throwOnError: false,
          trust: true,
          strict: false
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
      }
    }
  }, [content]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag 
      ref={containerRef} 
      className={`katex-renderer-container whitespace-pre-wrap ${className}`}
      {...(hasHtml 
        ? { dangerouslySetInnerHTML: { __html: content || '' } }
        : { children: content }
      )}
    />
  );
};

export default MathRenderer;

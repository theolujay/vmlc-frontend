'use client';

import React, { useEffect, useRef } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "", inline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMath = () => {
      if (typeof window !== 'undefined' && window.MathJax && window.MathJax.typesetPromise && containerRef.current) {
        // MathJax 3/4 typesetting is promise-based
        window.MathJax.typesetPromise([containerRef.current]).catch((err: unknown) => {
          console.error('MathJax typeset failed:', err);
        });
      }
    };

    renderMath();

    // If MathJax is not yet fully initialized (typesetPromise missing), 
    // it might be loading. We poll for the presence of typesetPromise.
    if (typeof window !== 'undefined' && (!window.MathJax || !window.MathJax.typesetPromise)) {
      const interval = setInterval(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          renderMath();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [content]);

  const Tag = inline ? 'span' : 'div';

  // Check if content looks like HTML to decide whether to use dangerouslySetInnerHTML
  const hasHtml = /<[a-z][\s\S]*>/i.test(content || '');

  return (
    <Tag 
      ref={containerRef} 
      className={`mathjax-renderer-container whitespace-pre-wrap ${className}`}
      {...(hasHtml 
        ? { dangerouslySetInnerHTML: { __html: content || '' } }
        : { children: content }
      )}
    />
  );
};

export default MathRenderer;
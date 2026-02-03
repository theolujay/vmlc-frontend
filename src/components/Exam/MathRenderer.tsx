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
      if (typeof window !== 'undefined' && window.MathJax && containerRef.current) {
        // MathJax 3/4 typesetting is promise-based
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          console.error('MathJax typeset failed:', err);
        });
      }
    };

    renderMath();

    // If MathJax is not yet available, it might be loading.
    // We can't easily listen for it without a custom event or polling,
    // but we can at least try again if window.MathJax becomes available.
    // Many apps use a small interval or wait for a specific promise.
    if (typeof window !== 'undefined' && !window.MathJax) {
      const interval = setInterval(() => {
        if (window.MathJax) {
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
'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = "", inline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const processContent = (text: string) => {
        if (!text) return "";

        // Process display math ($$...$$)
        let html = text.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: true, throwOnError: false });
          } catch (error) {
            console.error('KaTeX display math rendering error:', error);
            return match;
          }
        });

        // Process inline math ($...$)
        html = html.replace(/\$(.*?)\$/g, (match, p1) => {
          try {
            return katex.renderToString(p1, { displayMode: false, throwOnError: false });
          } catch (error) {
            console.error('KaTeX inline math rendering error:', error);
            return match;
          }
        });

        // Replace newlines with breaks only if not inline and if the text has multiple lines
        if (!inline && text.includes('\n')) {
          return html.replace(/\n/g, '<br/>');
        }

        return html;
      };

      containerRef.current.innerHTML = processContent(content);
    }
  }, [content, inline]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag 
      ref={containerRef} 
      className={`text-gray-800 ${className}`}
    />
  );
};

export default MathRenderer;
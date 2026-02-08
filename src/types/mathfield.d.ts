import * as React from 'react';
import type { MathfieldElement } from 'mathlive';

declare global {
  interface Window {
    MathJax: {
      typesetPromise?: (elements: (HTMLElement | null)[]) => Promise<void>;
    };
  }
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

export {};

import * as React from 'react';
import type { MathfieldElement } from 'mathlive';

declare global {
  interface Window {
    MathJax: any;
  }
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

export {};

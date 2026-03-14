import * as React from "react";
import type { MathfieldElement } from "mathlive";

declare global {
  interface Window {
    MathJax: {
      typesetPromise?: (elements: (HTMLElement | null)[]) => Promise<void>;
    };
  }
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >;
    }
  }
}

declare module "katex/dist/contrib/auto-render" {
  import { KatexOptions } from "katex";
  export default function renderMathInElement(
    element: HTMLElement,
    options?: KatexOptions & {
      delimiters?: {
        left: string;
        right: string;
        display: boolean;
      }[];
    },
  ): void;
}

export {};

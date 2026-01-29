export interface MathSymbol {
  label: string;
  latex: string;
  icon: string | React.ReactNode;
  command?: string;
}

export interface MathCategory {
  [key: string]: MathSymbol[];
}

export type MathMode = 'inline' | 'block';

export interface MathFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

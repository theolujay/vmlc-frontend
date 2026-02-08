export enum Difficulty {
    EASY = 'Easy',
    MODERATE = 'Moderate',
    HARD = 'Hard'
  }
  
  export interface QuestionOption {
    id: string;
    label: string;
    text: string;
    type: string;
  }
  
  export interface QuestionData {
    questionText: string;
    image?: File | string | null;
    options: QuestionOption[];
    difficulty: Difficulty;
  }
  
  export type MathSymbol = {
    label: string;
    latex: string;
    icon: string;
  };

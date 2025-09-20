export type Option = {
  value: string;
  label: string;
};

export type QuestionProps = {
  question: string;
  options: Option[];
  correctAnswer: string;
  questionNumber: number;
  totalQuestions: number;
};


export type ExamContextType = {
    showNav: boolean;
    setShowNav: React.Dispatch<React.SetStateAction<boolean>>;
};

export type User = {
  name: string;
  email: string;
  score: number;
  rank: number;
  avatar: string;
};

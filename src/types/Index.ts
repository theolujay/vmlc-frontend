export type ExamContextType = {
  showNav: boolean;
  setShowNav: React.Dispatch<React.SetStateAction<boolean>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

export type User = {
  name: string;
  email: string;
  score: number;
  rank: number;
  avatar: string;
};


export type VerificationDocumentType = {
  face_id?: File;
  id_card?: File;
  verification_document?: File
}


export type SelectItem={
    id:number | string,
    label:string
}


export type BulkPayloadType= {
    question_ids: number[],
    exam_ids: (number | string)[]
}


export type BulkArchiveType={
  question_ids:number[]
}

export type BulkActionType = {
action: 'archive' | 'assign' | 'unassign';
  question_ids: number[];
  exam_ids?: (number | string)[];
}
export type VerificationUploadPayloadType = FormData;

export type AnswerItem={
  question:number;
  selected_option:string;
}
export type CandidateSubmitAnswerType={
  answers: AnswerItem[]
}

export type ApiError = {
  response?: {
    data?: {
      message?: string;
      email?: string[];
      [key: string]: unknown;
    };
  };
  message?: string;
};
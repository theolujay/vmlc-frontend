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


export type VerificationDocumentType = {
  face_id?: File;
  id_card?: File;
  verification_document?: File
}



export type VerificationUploadPayloadType = FormData;

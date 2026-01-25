import { CreatedByType, RequestUserType } from "./auth";

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



type recentScoreType = {
  exam: string,
  score: number,
  date: Date,
  exam_stage: string
}

export type DashboardType = {
  candidate_info: CandidateInfoType,
  exam_stats: ExamStatType,
  leaderboard_ranking: LeaderboardRankingType | null,
  recent_scores: recentScoreType[],
  available_exams: AvailableExamType[],
  concluded_exams: ConcludedExamType[]
}


export type LeaderboardRankingType = {
  position: number,
  total_candidates: number
}





export type AvailableExamType = {
  id: string,
  title: string,
  description: string,
  open_duration_hours: number,
  // exam_date: Date,
  countdown_minutes: number,
  question_count: number,
  level:number,
  scheduled_date:Date
  stage: string,
  stage_display:string,
  participation: string
}

export type ConcludedExamType = {
  id: string,
  title: string,
  description: string,
  concluded_at: string,
  question_count: number,
  participation: string,
  stage: string,
  level: number,
  stage_display: string
}




export type PaginationType= {
        count: number,
        page: number,
        page_size: number,
        total_pages: number,
        has_next: boolean,
        has_previous: boolean,
        next: string,
        previous: string|null
    }

export type SessionType = {
  // count: number,
  // total_pages: number,
  // next: string,
  // previous: string | null,
  results: ExamSessionType[],
  // results:SessionQuestionItemType,
  pagination:PaginationType,
  question_pool_data: {
    total_questions: number,
    hard_questions_count: number,
    moderate_questions_count: number,
    easy_questions_count: number
  },

}


export type QuestionPoolType= {
  // count: number,
  // total_pages: number,
  // next: string,
  // previous: string | null,
  // results: ExamSessionType[],
  results:SessionQuestionItemType[],
  pagination:PaginationType,
  question_pool_data: {
    total_questions: number,
    hard_questions_count: number,
    moderate_questions_count: number,
    easy_questions_count: number
  },

}




export type ExamSessionType = {
  id: string,
  title: string,
  stage: string,
  question_count: number,
  exam_date: Date,
  created_at: Date
}










export type ExamStatType = {
  total_exams_taken: number,
  available_exams_count: number,
  average_score: number,
  highest_score: number,
  lowest_score: number,
  latest_score: number
}


export type CandidateInfoType = {
  first_name: string,
  last_name: string,
  role: string,
}

export type CreateExamSessionType = {
  title: string,
  stage: string,
  description: string,
}



export type CreateQuestionType = {
  text: string,
  option_a: string,
  option_b: string,
  option_c: string,
  option_d: string,
  correct_answer: string,
  difficulty: string
}

export type EditExamSession = {
  title: string,
  description: string
}


// export type QuestionType = {
//   id: number,
//   text: string,
//   option_a: string,
//   option_b: string,
//   option_c: string,
//   option_d: string,
//   correct_answer: string,
//   difficulty: string,
//   created_at: Date,
//   created_by: {
//     user: RequestUserType,
//     occupation: string,
//     role: string
//   }
// }





export type SessionQuestionType = {
  count: number,
  total_pages: number,
  next: string | null,
  previous: string | null,
  results: SessionQuestionItemType[]


}






export type SessionQuestionItemType = {
  id: number,
  text: string,
  option_a: string,
  option_b: string,
  option_c: string,
  option_d: string,
  correct_answer: string,
  difficulty: string,
  // related_exams_count: number,
  created_at: Date,
  created_by:CreatedByType,
  updated_at:Date,
  updated_by:string|null,
}






export type UpdatedSessionQuestionType = {
  id: string,
  title: string,
  stage: string,
  description: string,
  exam_date: Date,
  countdown_minutes: number,
  open_duration_hours: number,
  is_active: boolean,
  questions: QuestionType,
  created_at: Date
  created_by: {
    user: RequestUserType,
    occupation: string,
    role: string
  },
  updated_by: string | null,

  scheduled_date: Date,

  status: string,
  concluded_at: Date | null,


}


type QuestionType = {
  count: number,
  total_pages: number,
  next: string | null,
  previous: string | null,
  // meta: MetaType,
  // results: QuestionItemType[],
  results:SessionQuestionItemType
  question_pool_data: QuestionPoolDataType
}
type QuestionPoolDataType = {
  total_questions: number,
  hard_questions_count: number,
  moderate_questions_count: number,
  easy_questions_count: number
}
// type MetaType = {
//   total_count: number,
//   hard_questions_count: number,
//   moderate_questions_count: number,
//   easy_questions_count: number
// }

// type QuestionItemType = {
//   id: number,
//   text: string,
//   option_a: string,
//   option_b: string,
//   option_c: string,
//   option_d: string,
//   correct_answer: string,
//   difficulty: string,
//   related_exams_count: number,
//   // related_exams: RelatedExamType,
//   created_at: Date,


// }



// type RelatedExamType = {
//   count: number,
//   list: RelatedExamItemType[]
// }

// type RelatedExamItemType = {
//   id: number,
//   title: string,
//   description: string,
//   stage: string,
//   exam_date: Date
// }

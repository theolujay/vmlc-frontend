import { CreatedByType } from "./auth";

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



// New API Types based on CANDIDATE_DASHBOARD.md
export type CandidateContext = {
  full_name: string;
  role: string;
  profile_picture: string | null;
  is_setup_complete: boolean;
  status: string;
  notifications: Array<{
    id: number;
    type: string;
    message: string;
  }>;
};

export type DashboardStageProgress = {
  current_stage: string;
  current_round: number;
  total_rounds: number;
  published_rounds: number;
  has_taken_current_round: boolean;
  qualification_status: {
    is_qualified: boolean;
    advancement_policy: {
      mode: string;
      value: number;
    };
    message: string;
  };
};

export type ActiveExamType = {
  id: string;
  title: string;
  stage: string;
  round: number;
  question_count: number;
  starts_at: Date;
  ends_at: Date;
  duration_minutes: number;
  status: string;
  has_participated: boolean;
};

export type AvailableExamType = {
  id: string;
  title: string;
  description?: string;
  open_duration_hours: number;
  countdown_minutes: number;
  question_count: number;
  round: number;
  scheduled_date: Date;
  stage: string;
  stage_display: string;
  participation: 'done' | 'not_done';
};

export type LeaderboardRankingType = {
  current_rank?: number;
  position: number;
  total_candidates: number;
};

export type PerformanceSnapshotType = {
  screening_standing: {
    rank: number;
    total_candidates: number;
    score: number;
    percentile: number;
  } | null;
  league_leaderboard: {
    overall_rank: number;
    total_candidates: number;
    total_score: number;
    rank_change: number;
    as_of_round: number;
  } | null;
};

export type TakeExamQuestionType = {
  id: number;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

export type TakeExamType = {
  id: string;
  title: string;
  description: string;
  open_duration_hours: number;
  scheduled_date: Date;
  countdown_minutes: number;
  questions: TakeExamQuestionType[];
};

export type ExamHistoryItem = {
  exam_id: string;
  exam_title: string;
  stage: string;
  round: number | null;
  score: number;
  percentage: number;
  date: Date;
  status: string;
};

export type DashboardType = {
  candidate_context: CandidateContext;
  stage_progress: DashboardStageProgress;
  active_exam: ActiveExamType | null;
  performance_snapshot: PerformanceSnapshotType;
  exam_history: ExamHistoryItem[];
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
  count: number;
  next: string | null;
  previous: string | null;
  results: ExamSessionType[];
  pagination: PaginationType;
  question_pool_data: {
    total_questions: number;
    hard_questions_count: number;
    moderate_questions_count: number;
    easy_questions_count: number;
  };
};


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
  id: string;
  title: string;
  status: string;
  competition_title: string;
  question_count: number;
  scheduled_date: string;
  concluded_at: string | null;
  created_at: string;
  standings?: {
    exists: boolean;
    is_published: boolean;
    created_at: string;
    published_at: string | null;
  };
};










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
  description?: string;
  scheduled_date?: string;
  open_duration_hours?: number;
  countdown_minutes?: number;
  is_active?: boolean;
  questions?: number[];
  stage_id?: number;
  round?: number;
};

export type EditExamSession = {
  description?: string;
  scheduled_date?: string;
  open_duration_hours?: number;
  countdown_minutes?: number;
  is_active?: boolean;
  questions?: number[];
  stage_id?: number;
  round?: number;
};

export type CreateQuestionType = {
  text: string,
  option_a: string,
  option_b: string,
  option_c: string,
  option_d: string,
  correct_answer: string,
  difficulty: string,
  add_to_exams?: string[]
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
  id: string;
  title: string;
  description: string;
  status: string;
  is_active: boolean;
  is_currently_open: boolean;
  competition_title: string;
  open_duration_hours: number;
  countdown_minutes: number;
  scheduled_date: string;
  concluded_at: string | null;
  created_at: string;
  created_by: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
    };
  };
  updated_by: string | null;
  standings?: {
    exists: boolean;
    is_published: boolean;
    created_at: string;
    published_at: string | null;
  };
  questions: QuestionType;
};


type QuestionType = {
  count: number,
  total_pages: number,
  next: string | null,
  previous: string | null,
  // meta: MetaType,
  // results: QuestionItemType[],
  results:SessionQuestionItemType[]
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

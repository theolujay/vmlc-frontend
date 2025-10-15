import { RequestUserType } from "./auth";

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
  leaderboard_ranking: LeaderboardRankingType,
  recent_scores: recentScoreType[],
  available_exams: AvailableExamType[]
}


export type LeaderboardRankingType = {
  position: number,
  total_candidates: number
}
export type AvailableExamType = {
  id: number,
  title: string,
  description: string,
  open_duration_hours: number,
  exam_date: Date,
  countdown_minutes: number,
  question_count: number,
  stage: string
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
  name: string,
  email: string,
  phone: string,
  school: string,
  role: string,
  is_verified: boolean,
  date_joined: Date,
  profile_photo: string
}

export type CreateExamSessionType={
  title:string,
  stage:string,
  description:string,
}




export type QuestionType= {
            id: number,
            text: string,
            option_a: string,
            option_b:string,
            option_c: string,
            option_d: string,
            correct_answer: string,
            difficulty: string,
            date_created: Date,
            created_by: {
                "user": RequestUserType,
                occupation: string,
                role:string
            }
        }
import { RequestUserType } from "./auth"
import { PaginationType } from "./Examtype"

export type LeaderType = {
    rank: number,
    candidate: LeaderCandidateType,
    total_score: number
}
export type LeaderCandidateType = {
    role: string,
    user: RequestUserType
    school_name: string
}

export type LeaderItemType = {
    stage: string,
    round: number,
    stage_display: string,
    exam_title: string,
    total_candidates: number,
    average_score: number
}
export type LeaderBoardType = {
    snapshot_id: number,
    published_at: Date,
    available_leaderboards: LeaderItemType[]
}



export type RankedLeaderBoardType = {
    exam_details: ExamDetailsType,
    top_three: CandidateType[],
    remaining_candidates: CandidateType[],
    pagination: PaginationType

}

export type LeaderBoardResponse = LeaderBoardType | RankedLeaderBoardType;



type ExamDetailsType = {
    id: string,
    title: string,
    stage: string,
    round: number,
    scheduled_date: Date,
    concluded_at: Date,
    total_questions: number,
    total_candidates: number,
    average_score: number
}



export type CandidateType = {
    rank: number,
    profile: EachCandidate,
    score: number
    percentage: number
}


type EachCandidate = {
    id: string
    school_name: string
    full_name: string
    profile_picture: string | null
}








type CandidateExamDetailType = {
    id: string,
    title: string,
    stage: string,
    round: number,
    scheduled_date: Date,
    concluded_at: Date,
    total_questions: number,
    total_candidates: number,
    average_score: number
}


export type SubmissionItem = {
    option_a: string,
    option_b: string,
    option_c: string,
    option_d: string,
    is_correct: boolean,
    answered_at: Date,
    question_id: number,
    question_text: string,
    correct_answer: string,
    selected_option: string
}
export type ViewCandidateDetailType = {
    exam_details: CandidateExamDetailType,
   
    candidate_performance: {
        rank: number,
        score: number,
        candidate: {
            id: string,
            school_name: string,
            full_name: string,
            profile_picture: string | null,
            submissions: SubmissionItem[]
        },
        percentage: number,
         participated_at:Date,
    }
}









// export type LeaderBoardType = {
//     // total_pages: number,
//     next: string | null,
//     previous: string | null,
//     exam_details: {
//         total_exams: number,
//         screening_exams: number,
//         league_exams: number
//     },
//     list: LeaderItemType[]
// }

// export type LeaderItemType = {
//     exam_id: number,
//     exam_title: string,
//     exam_stage: string,
//     created_at: string,
// }

export type PaginatedType<T> = {
    count: number;
    total_pages: number,
    next: string | null,
    previous: string | null,
    results: T[]
}

export interface StandingsEntry {
  candidate: string;
  candidate_name: string;
  candidate_email: string;
  school_name: string;
  exam_score: string;
  rank: number;
  percentile: number;
  profile_picture?: string | null;
  tie_break_reason?: string | null;
}

export interface StandingsResponse {
  id: number;
  competition: number;
  stage: string;
  stage_display: string;
  round: number;
  exam: string;
  facilitator_system: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  entries: StandingsEntry[];
}

export interface LeagueLeaderboardEntry {
  candidate: string;
  candidate_name: string;
  candidate_email: string;
  school_name: string;
  total_score: string;
  overall_rank: number;
  rank_change: number;
  profile_picture?: string | null;
}

export interface LeagueLeaderboardResponse {
  id: number;
  competition: number;
  stage: string;
  stage_display: string;
  as_of_round: number;
  created_at: string;
  updated_at: string;
  entries: LeagueLeaderboardEntry[];
}

export interface CompetitionDashboardResponse {
  stats: {
    enrolled: number;
    active: number;
    eliminated: number;
    awaiting_next_challenge: number;
  };
  progress: {
    current_stage: string;
    current_round: number;
    total_rounds: number;
    published_rounds: number;
  };
  exams: any[]; // Using any[] for now or creating a specific ExamOperationalType
  leaderboard_summary: LeagueLeaderboardEntry[];
  latest_standings_summary: {
    exam_id: string;
    exam_title: string;
    entries: StandingsEntry[];
  } | null;
}


import { RequestUserType } from "./auth"
import { PaginationType } from "./Examtype"

export type LeaderType = {
    rank: number,
    candidate: LeaderCandidateType,
    total_score: number | string
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
    candidate: EachCandidate,
    score: number | string
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
    question: {
        id: number;
        text: string;
        option_a: string;
        option_b: string;
        option_c: string;
        option_d: string;
        correct_answer: string;
        difficulty: string;
    },
    selected_option: string | null,
    answered_at: string
}

export type ViewCandidateDetailType = {
    exam_details: CandidateExamDetailType,
    candidate_info: {
        id: string;
        full_name: string;
        email: string;
        state: string;
        school_name: string;
        school_type: string;
        current_class: string;
    },
    candidate_performance: {
        rank: number,
        score: number | string,
        percentile: number | null,
        time_used: number | null,
        face_capture?: string | null,
        recorded_at?: string | null,
        auto_score?: boolean,
        started_at?: string | null,
        submitted_at?: string | null,
        submissions: SubmissionItem[]
    }
}

export type PaginatedType<T> = {
    count: number;
    total_pages: number,
    next: string | null,
    previous: string | null,
    results: T[]
}

export interface RankingEntry {
  candidate: string;
  candidate_info: {
    id: string;
    full_name: string;
    email: string;
    state: string;
    school_name: string;
    school_type: string;
    current_class: string;
  };
  exam_score: string | number;
  rank: number;
  percentile: number;
  profile_picture?: string | null;
  time_used?: number | null;
}

export interface RankingResponse {
  id: number;
  competition: number;
  stage: string;
  stage_display: string;
  round: number;
  exam: string;
  facilitator_system: string;
  is_published: boolean;
  published_at: string;
  meta: {
    generated_by: string;
    ranking_policy: string;
    tie_break_strategy: string;
  };
  created_at: string;
  entries: RankingEntry[];
}

export interface LeagueLeaderboardEntry {
  candidate: string;
  candidate_info: {
    id: string;
    full_name: string;
    email: string;
    state: string;
    school_name: string;
    school_type: string;
    current_class: string;
  };
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
    disqualified: number;
  };
  progress: {
    current_stage: string;
    current_round: number;
    total_rounds: number;
    published_rounds: number;
  };
  exams: {
    id: string;
    title: string;
    stage: string;
    status: 'scheduled' | 'ongoing' | 'concluded';
    ranking_status: 'pending'| 'ready' | 'published';
    stats: {
      candidates_sat: number;
      avg_score: number;
      absent?: number;
    };
  }[];
  leaderboard_summary: LeagueLeaderboardEntry[];
  latest_ranking_summary: {
    exam_id: string;
    exam_title: string;
    entries: RankingEntry[];
  } | null;
}

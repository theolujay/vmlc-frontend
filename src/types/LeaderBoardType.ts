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
    school: string
}

export type LeaderItemType = {
    stage: string,
    level: number,
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
    id: number,
    title: string,
    stage: string,
    level: number,
    scheduled_date: Date,
    concluded_at: Date,
    total_questions: number,
    total_candidates: number,
    average_score: number
}



export type CandidateType = {
    rank: number,
    candidate: EachCandidate,
    score: number
    percentage:number
}


type EachCandidate={
    id:number
    school:string
    full_name:string
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


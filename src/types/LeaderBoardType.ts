import { RequestUserType } from "./auth"

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
export type LeaderBoardType = {
    total_pages: number,
    next: string | null,
    previous: string | null,
    exam_details: {
        total_exams: number,
        screening_exams: number,
        league_exams: number
    },
    list: LeaderType[]
}

export type PaginatedType<T> = {
    count: number;
    total_pages: number,
    next: string | null,
    previous: string | null,
    results: T[]
}


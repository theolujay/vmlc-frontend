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
export type LeaderBoardType = LeaderType[]


export type PaginatedType<T>= {
    count: number;
    total_pages: number,
    next: string | null,
    previous: string | null,
    results: T[]
}


import { ExamStatType } from "./Examtype"


export type CandidateType = {
    candidate_info: {
        name: string,
        email: string,
        phone: string,
        school: string,
        role: string,
        is_verified: string,
        date_joined: Date
    },
    exam_stats: ExamStatType,
    leaderboard_ranking: number | null,
    recent_scores: RecentScoreType[] | null,
    available_exams: string[] | null
}



export type RecentScoreType = {
    exam_title: string,
    score: number,
    date: Date,
    exam_stage: string
}
import { RequestUserType } from "./auth"



export type CandidateType={
    user:RequestUserType,
    school:string,
    face_id: string|null,
    role:string,
    is_active:boolean,
    is_verified: boolean,
    id_card: string|null,
    verification_document: string|null,
    created_at: Date,
    updated_at: Date,
    records: RecordsType
}


export type RecordsType={
        performance: {
            stats:StatsType
            exams:ExamTakenType[]
        },
        available_exams: unknown[]
    }

export type StatsType= {
                total_score: number,
                average_score: number
                leaderboard_ranking:number| null,
                latest_score: {
                    score: number|null,
                    exam_title: number|null,
                    date:Date
                },
                highest_score: number,
                total_exams_taken: number,
                lowest_score:number,
                highest_obtainable_score: number
            }

// export type CandidateType = {
//     candidate_info: {
//         name: string,
//         email: string,
//         phone: string,
//         school: string,
//         role: string,
//         is_verified: string,
//         date_joined: Date
//     },
//     exam_stats: ExamStatType,
//     leaderboard_ranking: number | null,
//     recent_scores: RecentScoreType[] | null,
//     available_exams: string[] | null
// }



export type ExamTakenType=  {
                    exam_id: number,
                    exam_title:string,
                    exam_stage: string,
                    exam_date:Date,
                    score: number,
                    recorded_at: Date,
                    submitted_by:string,
                    auto_score: boolean
                }

export type RecentScoreType = {
    exam_title: string,
    score: number,
    date: Date,
    exam_stage: string
}
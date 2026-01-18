import { ActivityHistoryUserType, RequestUserType } from "./auth"
import { PaginationType } from "./Examtype"


export type CandidateListType = {
    results: ActivityHistoryUserType[],
    pagination: PaginationType
}


// export type CandidateItemType = {
//     user: RequestUserType,
//     school: string,
//     role: string,
//     is_user_verified: boolean
// }


export type CandidateType = {
    user: RequestUserType,
    school_name: string,
    status: string,
    face_id: string | null,
    role: string,
    is_active: boolean,
    is_verified: boolean,
    id_card: string | null,
    verification_document: string | null,
    created_at: Date,
    updated_at: Date,
    records: RecordsType
}


export type RecordsType = {
    performance: {
        stats: StatsType
        exams_taken: ExamTakenType[]
    },
    available_exams: unknown[]
}

export type StatsType = {
    total_score: number,
    average_score: number,
    leaderboard_ranking:{
                    current_rank: number,
                    total_candidates: number
                } | null,
    // leaderboard_ranking: number | null,
    latest_score: {
        score: number | null,
        exam_title: number | null,
        date: Date
    },
    highest_score: number,
    total_exams_taken: number,
    lowest_score: number,
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



export type ExamTakenType = {
    exam_id: string,
    exam_title: string,
    exam_stage: string,
    exam_date: Date,
    score: number,
    recorded_at: Date,
    submitted_by: string,
    auto_score: boolean,
    submission: submissionItemType[]
}

export type RecentScoreType = {
    exam_title: string,
    score: number,
    date: Date,
    exam_stage: string
}





export type submissionItemType = {
    question_id: number,
    question_text: string,
    option_a: string,
    option_b: string,
    option_c: string,
    option_d: string,
    selected_option: string,
    answered_at: Date
}
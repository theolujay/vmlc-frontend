import { RequestUserType } from "./auth";
import { PaginatedType } from "./LeaderBoardType";


export type UserMgtType=PaginatedType<MgtTypeItem>;


export type MgtTypeItem = {
    user: RequestUserType
    role: string,
    occupation: string
}



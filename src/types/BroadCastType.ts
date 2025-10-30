import { CreatedByType } from "./auth"

export type BroadcastType = {
    count: number,
    total_pages: number,
    next: string | null,
    previous: string | null,
    results: BroadcastItemType[]
}



type BroadcastItemType = {
    id: number,
    subject: string,
    message: string,
    created_by: CreatedByType,
    created_at: Date,
    mediums: string[],
    target_roles: string[]
}




export type CreateBroadCastType={
    subject: string,
  message: string,
  mediums:string[],
  target_roles:string[]
}


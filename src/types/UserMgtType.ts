import { FieldValues, UseFormReturn } from "react-hook-form";
import { RequestUserType } from "./auth";
import { PaginatedType } from "./LeaderBoardType";
import { PaginationType } from "./Examtype";


// export type UserMgtType = PaginatedType<MgtTypeItem>;


export type MgtTypeItem = {
  user: RequestUserType
  role: string,
  occupation: string
}



export type InviteStaffMemberPayloadType = {
  email: string,
  first_name: string,
  last_name: string,
  phone: string,
  // password: string,
  // password2:string,
  role?: string,
  occupation?: string
}



export type AddStaffMemberFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
};


export type StatOverviewType = {
  candidates: OverviewType,
  staff: OverviewType
}

export type UserMgtType = {
  pagination: PaginationType,
  // stats_overview: {
  //   candidates: OverviewType,
  //   staff: OverviewType
  // },
  stats_overview: StatOverviewType,
  results: MgtItem[]|MgtItemType[]
}





export type OverviewType = {
  registered: number,
  active: number,
  inactive: number,
  pre_registered: number,
  deactivated: number
}




export type MgtItem = {
  user: RequestUserType & { is_email_verified: boolean, },
  school: string | null,
  role: string,
  status: string,
  profile_type: string,
  occupation: string | null,
  is_user_verified: boolean
}

export type MgtItemType = {
  id: string,
  email: string,
  is_email_verified: boolean,
  first_name: string,
  last_name: string,
  profile_picture: string | null,
  phone: string | null,
  date_joined: Date
}

export type StaffUserType = RequestUserType & {
  is_email_verified: boolean,
  profile_picture: string | null,
}


export type UserProfileType = {
  user: StaffUserType
  occupation: string,
  face_id: string | null,
  role: string,
  profile_type: string,
  is_active: boolean,
  is_user_verified: boolean,
  id_card: string | null,
  verification_document: string | null,
  created_at: Date,
  updated_at: Date
}

export type StaffDetailsType = {
  profile: UserProfileType

}


export type VerificationStatusPayloadType = {
 is_approved: boolean
}



export type RejectionStatusPayloadType = {
  is_rejected: boolean,
  rejection_reason: string
}

export type HandleVerificationStatusPayloadType = VerificationStatusPayloadType | RejectionStatusPayloadType;
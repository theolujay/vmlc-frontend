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


export type StatOverviewType={
    candidates: OverviewType,
    staff: OverviewType
  }

export type UserMgtType = {
  pagination: PaginationType,
  // stats_overview: {
  //   candidates: OverviewType,
  //   staff: OverviewType
  // },
  stats_overview:StatOverviewType,
  results: MgtItem[ ]
}



export type OverviewType={
      registered: number,
      active: number,
      inactive: number,
      pending_verification: number,
      deactivated: number
    }

export type MgtItem = {
  id: string,
  email: string,
  is_email_verified: boolean,
  first_name: string,
  last_name: string,
  profile_picture: string | null,
  phone: string | null,
  date_joined: Date
}
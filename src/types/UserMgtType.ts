import { FieldValues, UseFormReturn } from "react-hook-form";
import { RequestUserType } from "./auth";
import { PaginatedType } from "./LeaderBoardType";


export type UserMgtType=PaginatedType<MgtTypeItem>;


export type MgtTypeItem = {
    user: RequestUserType
    role: string,
    occupation: string
}



export type InviteStaffMemberPayloadType={
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
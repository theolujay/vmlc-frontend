import { FieldValues, UseFormReturn } from "react-hook-form";
import { RequestUserType } from "./auth";
// import { PaginatedType } from "./LeaderBoardType";
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


export type CompetitionStage = {
  id: number;
  name: string;
  type: string;
  rounds?: number[];
};

export type CompetitionData = {
  active_competition: string;
  active_competition_id: number;
  stages: CompetitionStage[];
};

export type StatOverviewType = {
  candidates: OverviewType;
  staff: OverviewType;
  exams: ExamOverviewType;
  competition: CompetitionData;
  funnel: {
    overall: FunnelData;
    candidate: FunnelData;
    volunteer: FunnelData;
  };
  geographics: {
    overall: GeographicData[];
    candidate: GeographicData[];
    volunteer: GeographicData[];
  };
};

export type FunnelData = {
  pre_registrations: number;
  completed_registrations: number;
  conversion_percentage: number;
};

export type GeographicData = {
  state: string;
  count: number;
};

export type ExamOverviewType = {
  total: number;
  active: number;
  ongoing: number;
  upcoming: number;
  concluded: number;
  drafts: number;
  upcoming_change?: string;
  active_change?: string;
};

export type OverviewType = {
  registered: number;
  active: number;
  once_logged_in: number;
  inactive: number;
  pre_registered: number;
  deactivated: number;
  both_entities?: number;
  registered_change?: string;
  active_change?: string;
  pre_registered_change?: string;
};


export type RegistrationStatusType = {
  candidate_registration: {
    is_open: boolean;
    closing_date: string | null;
  };
  staff_registration: {
    is_open: boolean;
    closing_date: string | null;
  };
  support_email: string;
};


export type UserMgtType = {
  pagination: PaginationType;
  stats_overview: StatOverviewType;
  results: MgtItem[] | MgtItemType[];
};

export type MgtItem = {
  user: RequestUserType & { is_email_verified: boolean, },
  school_name: string | null,
  current_class: string | null,
  role: string,
  status: string,
  profile_type: string,
  occupation: string | null
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
  occupation: string | null,
  school_name?: string | null,
  school_type?: string | null,
  current_class?: string | null,
  role: string,
  profile_type: string,
  is_active: boolean,
  verification_document: string | null,
  verification_document_type: string | null,
  created_at: Date,
  updated_at: Date,
  is_setup_complete: boolean,
}

export type StaffDetailsType = {
  profile: UserProfileType

}





export type PreRegisteredCandidate = {

  full_name: string;

  email: string;

  phone: string;

  created_at: string;

}



export type PreRegisteredCandidateType = {

  pagination: PaginationType;

  stats_overview: null;

  results: PreRegisteredCandidate[];

}

export type RegistrationTrendData = {
  date?: string;
  day?: string;
  week?: string;
  count: number;
};

export type RegistrationTrendType = {
  daily: {
    total_users: RegistrationTrendData[];
    candidates: RegistrationTrendData[];
    staff: RegistrationTrendData[];
    pre_registrations: RegistrationTrendData[];
  };
  weekly: {
    total_users: RegistrationTrendData[];
    candidates: RegistrationTrendData[];
    staff: RegistrationTrendData[];
    pre_registrations: RegistrationTrendData[];
  };
  funnel: {
    pre_registrations: number;
    completed_registrations: number;
    conversion_percentage: number;
  };
};

export type HandleVerificationStatusPayloadType = {
  is_approved?: boolean;
  is_rejected?: boolean;
  rejection_reason?: string;
};
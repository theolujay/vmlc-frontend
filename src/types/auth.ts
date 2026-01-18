export type RegisterRequest = {
    user: {
        email: string,
        first_name: string,
        last_name: string,
        phone: string,
    },
    password: string,
    password2: string,
    school_name: string
}

export type LoginRequest = {
    email: string,
    password: string
}

export type LogoutRequest = {
    refresh: string
}


export type VerifyRequest = {
    email: string,
    otp: string
}



export type AuthRegisterResponse = {
    message: string
}




export type SetNewPasswordType = {
    email: string,
    otp: string,
    new_password: string,
    confirm_password: string
}


export type AuthLoginResponse = {
    refresh: string;
    access: string;
    profile: {
        // user: {
        //     id: string;
        //     email: string;
        //     first_name: string;
        //     last_name: string;
        //     phone: string;
        //     date_joined: Date;
        // },
        user: RequestUserType,
        school_name: string;
        role: string;
    }
}


type User = RequestUserType & {
    role: string,
    school_name: string
}

export type RequestUserType = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_joined: Date;
}



export type CreatedByType = {
    user: RequestUserType,
    occupation: string,
    role: string
}

export type AuthState = {
    token: string | null;
    homePath?: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
    // user: { [x: string]: any } | null;
    userType: string | null;
}






export type ActivityHistoryUserType = {
    user: RequestUserType,
    school_name: string | null,
    role: string,
    status:string,
    is_user_verified: boolean
}


export type RegisterRequestValueType= {
    email: string;
    
    first_name: string;
    phone: string;
    last_name: string;
    school_name: string;
    generate_password: boolean;
    password?: string | undefined;
    password2?: string | undefined;
}

export type RegisterStaffRequestValueType={
    email: string;
    password: string;
    password2: string;
    first_name: string;
    phone: string;
    last_name: string;
    occupation: string;
}




export type RegAvailableType = {
    is_candidate_reg_open:boolean,
    is_staff_reg_open:boolean,
    support_email: string
}
export type RegisterRequest = {
    user: {
        email: string,
        first_name: string,
        last_name: string,
        phone: string,
    },
    password: string,
    password2: string,
    school: string
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
        school: string;
        role: string;
    }
}


type User = RequestUserType & {
    role: string,
    school: string
}

type RequestUserType = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    date_joined: Date;
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



export type ActivityHistoryUserType={
    user:RequestUserType,
      school:string,
    role:string,
      is_verified: boolean
    }
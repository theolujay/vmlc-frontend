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

export type AuthRegisterResponse = {

    message: string

}




export type AuthLoginResponse = {
    refresh: string;
    access: string;
    profile: {
        user: {
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            phone: string;
            date_joined: Date;
        },
        school: string;
        role: string;
    }
}




export type AuthState = {
    token: string | null;
    homePath?: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: { [x: string]: any } | null;
    userType: string | null;
}
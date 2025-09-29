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

export type AuthResponse={
    
  message: string

}
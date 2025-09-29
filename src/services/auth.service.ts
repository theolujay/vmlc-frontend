import { authUrls } from "@/constants/authUrls";
import { AuthLoginResponse, AuthRegisterResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import client from "@/utils/axios";

export class AuthService {
    static async register(user: RegisterRequest): Promise<AuthRegisterResponse> {
        const response = client.post(authUrls.candidate_registeration, user);
        console.log(response, 'what is here')
        return (await response).data.data;
    }

    static async login(payload:LoginRequest):Promise<AuthLoginResponse>{
        const response=client.post(authUrls.login,payload);
        console.log(response,'what is login payload')
        return (await response).data.data;
    }
}
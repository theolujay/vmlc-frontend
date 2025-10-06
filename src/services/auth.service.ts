import { authUrls } from "@/constants/authUrls";
import { ValueType } from "@/hooks/useRegister";
import { AuthLoginResponse, AuthRegisterResponse, LoginRequest, } from "@/types/auth";
import client from "@/utils/axios";

export class AuthService {
    static async register(user: ValueType): Promise<AuthRegisterResponse> {
        const response = client.post(authUrls.candidate_registeration, user);
        return (await response).data.data;
    }

    static async login(payload:LoginRequest):Promise<AuthLoginResponse>{
            const response=await client.post(authUrls.login,payload);
            return response.data;
        
    }
}
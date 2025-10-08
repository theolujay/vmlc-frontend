import { authUrls } from "@/constants/authUrls";
import { ValueType } from "@/hooks/useRegister";
import { AuthLoginResponse, AuthRegisterResponse, LoginRequest, VerifyRequest, } from "@/types/auth";
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

    static async verifyEmail(payload:VerifyRequest){
        const response=await client.post(authUrls.verify,payload);
        console.log(response,'from verify')
        return response.data;
    }

    static async resendOtp(payload:Omit<VerifyRequest,'otp'>){
        const response=await client.post(authUrls.resendOtp,payload)
        console.log(response,'from resend')
        return response.data
    }
}
import { authUrls } from "@/constants/authUrls";
import { ValueType } from "@/hooks/useRegister";
import { StaffValueType } from "@/hooks/useRegisterStaff";
import { AuthLoginResponse, AuthRegisterResponse, LoginRequest, LogoutRequest, SetNewPasswordType, VerifyRequest, } from "@/types/auth";
import client from "@/utils/axios";

export class AuthService {
    static async registerCandidate(user: ValueType): Promise<AuthRegisterResponse> {
        const response = client.post(authUrls.candidate_registeration, user);
        return (await response).data.data;
    }

    static async registerStaff(user: StaffValueType): Promise<AuthRegisterResponse> {
        const response = client.post(authUrls.staff_registeration, user);
        return (await response).data.data;
    }

    static async login(payload: LoginRequest): Promise<AuthLoginResponse> {
        const response = await client.post(authUrls.login, payload);
        return response.data;

    }

    static async logout(payload: LogoutRequest) {
        const response = await client.post(authUrls.logout, payload);
        return response.data;
    }

    static async verifyEmail(payload: VerifyRequest) {
        const response = await client.post(authUrls.verify, payload);
        return response.data;
    }

    static async resendOtp(payload: Omit<VerifyRequest, 'otp'>) {
        const response = await client.post(authUrls.resendOtp, payload)
        return response.data
    }



    static async sendOtpForForgotPassword(payload: VerifyRequest) {
        const response = await client.post(authUrls.sendOtpForForgotPassword, payload);
        return response.data;
    }


    static async passwordChange(payload: Omit<VerifyRequest, 'otp'>) {
        const response = await client.post(authUrls.passwordChange, payload)
        return response.data
    }

    static async setNewPassword(payload: SetNewPasswordType) {
        const response = await client.post(authUrls.setNewPassword, payload)
        return response.data
    }

    static async passwordChangeResendOtp(payload: Omit<VerifyRequest, 'otp'>) {
        const response = await client.post(authUrls.passwordChangeResendOtp, payload)
        return response.data
    }

}
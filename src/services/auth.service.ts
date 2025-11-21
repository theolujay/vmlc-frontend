import { authUrls } from "@/constants/authUrls";
// import { ValueType } from "@/hooks/useRegister";
import { StaffValueType } from "@/hooks/useRegisterStaff";
import { AuthLoginResponse, AuthRegisterResponse, LoginRequest, LogoutRequest, RegisterRequestValueType, RegisterStaffRequestValueType, SetNewPasswordType, VerifyRequest, } from "@/types/auth";
import client from "@/utils/axios";

export class AuthService {

    static async isRegistrationAvailable(){
        try {
            const response=await client.get(authUrls.is_registrations_available);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async registerCandidate(user: RegisterRequestValueType): Promise<AuthRegisterResponse> {
        try {
            const response = await client.post(authUrls.candidate_registeration, user);
            return response.data.data;

        } catch (error) {
            console.error(error)
            throw error;

        }
    }

    static async registerStaff(user: RegisterStaffRequestValueType): Promise<AuthRegisterResponse> {
        try {

            const response = await client.post(authUrls.staff_registeration, user);
            return response.data.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    static async login(payload: LoginRequest): Promise<AuthLoginResponse> {
        try {

            const response = await client.post(authUrls.login, payload);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

    static async logout(payload: LogoutRequest) {
        try {

            const response = await client.post(authUrls.logout, payload);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    static async verifyEmail(payload: VerifyRequest) {
        try {

            const response = await client.post(authUrls.verify, payload);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    static async resendOtp(payload: Omit<VerifyRequest, 'otp'>) {
        const response = await client.post(authUrls.sendOtp, payload)
        return response.data
    }



    static async sendOtp(payload:{email:string}){
        const response=await client.post(authUrls.sendOtp,payload);
        return response.data;
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
import { authUrls } from "@/constants/authUrls";
import { AuthResponse, RegisterRequest } from "@/types/auth";
import client from "@/utils/axios";

export class AuthService {
    static async register(user: RegisterRequest): Promise<AuthResponse> {
        const response = client.post(authUrls.candidate_registeration, user);
        console.log(response, 'what is here')
        return (await response).data.data;
    }
}
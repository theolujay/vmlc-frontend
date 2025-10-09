import { verificationUrls } from "@/constants/verificationUrls";
import client from "@/utils/axios";

export class VerificationService{
    static async getVerificationStatus(){
        const response=await client.get(verificationUrls.USER_VERIFICATION_STATUS);
        return response.data.data;
    }


    static async uploadVerificationDocuments(payload:any){
        const response=await client.post(verificationUrls.UPLOAD_VERIFICATION,payload);
        return response.data;
    }
}
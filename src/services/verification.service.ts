import { verificationUrls } from "@/constants/verificationUrls";
import { VerificationUploadPayloadType } from "@/types/Index";
import client from "@/utils/axios";

export class VerificationService {
    static async getVerificationStatus() {
        const response = await client.get(verificationUrls.USER_VERIFICATION_STATUS);
        return response.data.data ?? null;
    }


    static async uploadVerificationDocuments(payload: VerificationUploadPayloadType) {
        const response = await client.post(verificationUrls.UPLOAD_VERIFICATION, payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
}
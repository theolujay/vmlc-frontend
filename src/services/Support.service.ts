import { SupportUrls } from "@/constants/supportUrls";
import { SendMessagePayload, SupportThreadListResponse, SupportThreadType, SupportMessageType } from "@/types/SupportType";
import client from "@/utils/axios";

export class SupportService {
    /**
     * Get or create a support thread for the candidate.
     */
    static async getOrCreateThread(): Promise<SupportThreadType> {
        try {
            const response = await client.get(SupportUrls.getOrCreateThread);
            return response.data;
        } catch (error) {
            console.error('Error getting or creating thread:', error);
            throw error;
        }
    }

    /**
     * Post a message to a support thread.
     */
    static async postMessage(payload: SendMessagePayload): Promise<SupportMessageType> {
        try {
            const response = await client.post(SupportUrls.postMessage(payload.thread_id), {
                text: payload.text,
                metadata: payload.metadata
            });
            return response.data;
        } catch (error) {
            console.error('Error posting message:', error);
            throw error;
        }
    }

    /**
     * List all support threads for staff.
     */
    static async listThreads(page?: number, filters?: Record<string, string>): Promise<SupportThreadListResponse> {
        try {
            const params: Record<string, string> = {};
            if (page) params.page = page.toString();
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        params[key] = value;
                    }
                });
            }
            const queryParams = new URLSearchParams(params).toString();
            const response = await client.get(SupportUrls.listThreads(queryParams));
            return response.data;
        } catch (error) {
            console.error('Error listing threads:', error);
            throw error;
        }
    }

    /**
     * Get details for a specific support thread (Staff).
     */
    static async getThreadDetail(threadId: string): Promise<SupportThreadType> {
        try {
            const response = await client.get(SupportUrls.getThreadDetail(threadId));
            return response.data;
        } catch (error) {
            console.error('Error getting thread detail:', error);
            throw error;
        }
    }
}

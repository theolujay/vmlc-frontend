import { SupportUrls } from "@/constants/supportUrls";
import { SendMessagePayload, SupportConversationListResponse, SupportMessageType } from "@/types/SupportType";
import client from "@/utils/axios";

export class SupportService {
    static async getConversations(page?: number, filters?: Record<string, string>): Promise<SupportConversationListResponse> {
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
            const response = await client.get(SupportUrls.getConversations(queryParams));
            return response.data;
        } catch (error) {
            console.error(error, 'Error getting conversations')
            throw error;
        }
    }

    static async getMessages(conversationId: string): Promise<SupportMessageType[]> {
        try {
            const response = await client.get(SupportUrls.getMessages(conversationId));
            return response.data;
        } catch (error) {
            console.error(error, 'Error getting messages');
            throw error;
        }
    }

    static async sendMessage(payload: SendMessagePayload): Promise<SupportMessageType> {
        try {
            const response = await client.post(SupportUrls.sendMessage(payload.conversation_id), { content: payload.content });
            return response.data;
        } catch (error) {
            console.error(error, 'Error sending message');
            throw error;
        }
    }
}

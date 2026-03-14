import { HelpdeskUrls } from "@/constants/helpdeskUrls";
import {
  SendMessagePayload,
  HelpdeskThreadListResponse,
  HelpdeskThreadType,
  HelpdeskMessageType,
} from "@/types/HelpdeskType";
import client from "@/utils/axios";

export class HelpdeskService {
  /**
   * Get or create a helpdesk thread for the candidate.
   */
  static async getOrCreateThread(): Promise<HelpdeskThreadType> {
    try {
      const response = await client.get(HelpdeskUrls.getOrCreateThread);
      return response.data;
    } catch (error) {
      console.error("Error getting or creating thread:", error);
      throw error;
    }
  }

  /**
   * Post a message to a helpdesk thread.
   */
  static async postMessage(
    payload: SendMessagePayload,
  ): Promise<HelpdeskMessageType> {
    try {
      const response = await client.post(
        HelpdeskUrls.postMessage(payload.thread_id),
        {
          text: payload.text,
          metadata: payload.metadata,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error posting message:", error);
      throw error;
    }
  }

  /**
   * List all helpdesk threads for staff.
   */
  static async listThreads(
    page?: number,
    filters?: Record<string, string>,
  ): Promise<HelpdeskThreadListResponse> {
    try {
      const params: Record<string, string> = {};
      if (page) params.page = page.toString();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params[key] = value;
          }
        });
      }
      const queryParams = new URLSearchParams(params).toString();
      const response = await client.get(HelpdeskUrls.listThreads(queryParams));
      return response.data;
    } catch (error) {
      console.error("Error listing threads:", error);
      throw error;
    }
  }

  /**
   * Get details for a specific helpdesk thread (Staff).
   */
  static async getThreadDetail(threadId: string): Promise<HelpdeskThreadType> {
    try {
      const response = await client.get(HelpdeskUrls.getThreadDetail(threadId));
      return response.data;
    } catch (error) {
      console.error("Error getting thread detail:", error);
      throw error;
    }
  }

  /**
   * Perform an action on a helpdesk thread (Staff).
   */
  static async performThreadAction(
    threadId: string,
    payload: { status: string; snoozed_until?: string },
  ): Promise<void> {
    try {
      await client.patch(HelpdeskUrls.threadAction(threadId), payload);
    } catch (error) {
      console.error("Error performing thread action:", error);
      throw error;
    }
  }
}

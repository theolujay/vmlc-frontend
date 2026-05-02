import { UserMgtUrls } from "@/constants/UserMgtUrls";
import {
  HandleVerificationStatusPayloadType,
  InviteStaffMemberPayloadType,
  PreRegisteredCandidateType,
  RegistrationStatusType,
  RegistrationTrendType,
  StaffDetailsType,
  UserMgtType,
} from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
  static async getUserList(
    page?: number,
    filters?: Record<string, string>,
  ): Promise<UserMgtType> {
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
      const response = await client.get(UserMgtUrls.getUserList(queryParams));
      return response.data;
    } catch (error) {
      console.error(error, "Error getting list");
      throw error;
    }
  }

  static async getPreRegisteredCandidateList(
    page: number,
    filters: Record<string, string>,
  ): Promise<PreRegisteredCandidateType> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value !== undefined && value !== "",
          ),
        ),
      });
      const response = await client.get(
        UserMgtUrls.getUserList(
          `profile=pre_reg_candidate&${queryParams.toString()}`,
        ),
      );
      return response.data;
    } catch (error) {
      console.error(error, "Error getting list");
      throw error;
    }
  }

  static async getStatOverview() {
    try {
      const response = await client.get(UserMgtUrls.STATISTICS_OVERVIEW);

      return response.data;
    } catch (error) {
      console.error(error, "what is error");

      throw error;
    }
  }

  static async getRegistrationStatus(): Promise<RegistrationStatusType> {
    try {
      const response = await client.get(UserMgtUrls.REGISTRATION_STATUS);

      return response.data;
    } catch (error) {
      console.error(error, "Error getting registration status");

      throw error;
    }
  }

  static async getRegistrationTrends(
    days: number,
  ): Promise<RegistrationTrendType> {
    try {
      const response = await client.get(UserMgtUrls.REGISTRATION_TRENDS(days));
      return response.data;
    } catch (error) {
      console.error(error, "Error getting registration trends");
      // Mock data for prototype since backend might not be ready
      const mockData = Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return {
          day: d.toISOString(),
          count: Math.floor(Math.random() * 50) + 5,
        };
      });

      return {
        daily: {
          total_users: mockData,
          candidates: mockData.map((d) => ({
            ...d,
            count: Math.floor(d.count * 0.8),
          })),
          staff: mockData.map((d) => ({
            ...d,
            count: Math.floor(d.count * 0.2),
          })),
          pre_registrations: mockData.map((d) => ({
            ...d,
            count: Math.floor(d.count * 1.5),
          })),
        },
        weekly: {
          total_users: [],
          candidates: [],
          staff: [],
          pre_registrations: [],
        },
        funnel: {
          pre_registrations: 1000,
          completed_registrations: 800,
          conversion_percentage: 80,
        },
      };
    }
  }

  static async inviteStaffMember(
    payload: InviteStaffMemberPayloadType,
  ): Promise<{ message: string }> {
    try {
      const response = await client.post(
        UserMgtUrls.inviteStaffMember,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error inviting staff member:", error);
      throw new Error("Failed to invite staff member");
    }
  }

  static async handleVerificationStatus(
    user_id: string,
    payload: HandleVerificationStatusPayloadType,
  ) {
    try {
      const response = await client.post(
        UserMgtUrls.HANDLE_VERIFICATION_STATUS(user_id),
        payload,
      );
      return response.data;
    } catch (error) {
      console.error(error, "Error handling verification status");
      throw error;
    }
  }

  static async getAccountDetails(user_id: string): Promise<StaffDetailsType> {
    try {
      const response = await client.get(UserMgtUrls.ACCOUNT_DETAILS(user_id));
      return response.data;
    } catch (error) {
      console.error(error, "Error fetching account details");
      throw error;
    }
  }

  static async getOwnAccountDetails(): Promise<StaffDetailsType> {
    try {
      const response = await client.get(UserMgtUrls.ACCOUNT_MGT);
      return response.data;
    } catch (error) {
      console.error(error, "Error fetching own account details");
      throw error;
    }
  }

  static async updateOwnProfile(payload: FormData | Record<string, unknown>) {
    try {
      const headers: Record<string, string> = {};
      if (payload instanceof FormData) {
        // Axios will set the correct Content-Type for FormData automatically
      } else {
        headers["Content-Type"] = "application/json";
      }
      const response = await client.patch(UserMgtUrls.ACCOUNT_MGT, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(error, "Error updating profile");
      throw error;
    }
  }

  static async exportUsers(filters?: Record<string, string>): Promise<Blob> {
    try {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params[key] = value;
          }
        });
      }
      const queryParams = new URLSearchParams(params).toString();
      const response = await client.get(UserMgtUrls.exportUsers(queryParams), {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error(error, "Error exporting users");
      throw error;
    }
  }

  static async sendBulkNotification(payload: {
    user_ids: string[];
    subject: string;
    message: string;
    medium?: string;
  }): Promise<{ message: string; broadcast_id: number }> {
    try {
      const response = await client.post(UserMgtUrls.bulkNotification, payload);
      return response.data;
    } catch (error) {
      console.error(error, "Error sending bulk notification");
      throw error;
    }
  }

  static async resetUserPassword(userId: string): Promise<{ message: string }> {
    try {
      const response = await client.post(UserMgtUrls.resetPassword, { user_id: userId });
      return response.data;
    } catch (error) {
      console.error(error, "Error resetting password");
      throw error;
    }
  }

  static async getUserActivity(userId: string): Promise<{
    user: { id: string; email: string; first_name: string; last_name: string };
    activities: { event_name: string; timestamp: string; metadata: Record<string, unknown> }[];
  }> {
    try {
      const response = await client.get(UserMgtUrls.userActivity(userId));
      return response.data;
    } catch (error) {
      console.error(error, "Error fetching user activity");
      throw error;
    }
  }
}

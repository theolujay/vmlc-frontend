import { UserMgtUrls } from "@/constants/UserMgtUrls";
import { HandleVerificationStatusPayloadType, InviteStaffMemberPayloadType, PreRegisteredCandidateType, RegistrationTrendType, StaffDetailsType, UserMgtType } from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
    static async getUserList(page?: number, filters?: Record<string, string>): Promise<UserMgtType> {
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
            const response = await client.get(UserMgtUrls.getUserList(queryParams));
            return response.data;
        } catch (error) {
            console.error(error, 'Error getting list')
            throw error;
        }
    }


    static async getPreRegisteredCandidateList(page: number, filters: Record<string, string>): Promise<PreRegisteredCandidateType> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''))
            })
            const response = await client.get(UserMgtUrls.getUserList(`profile=pre_reg_candidate&${queryParams.toString()}`));
            return response.data;
        } catch (error) {
            console.error(error, 'Error getting list')
            throw error;
        }
    }


    static async getStatOverview() {
        try {
            const response = await client.get(UserMgtUrls.STATISTICS_OVERVIEW);

            return response.data
        } catch (error) {
            console.error(error, 'what is error')
            throw error;
        }
    }

    static async getRegistrationTrends(days: number): Promise<RegistrationTrendType> {
        try {
            const response = await client.get(UserMgtUrls.REGISTRATION_TRENDS(days));
            return response.data;
        } catch (error) {
            console.error(error, 'Error getting registration trends');
            // Mock data for prototype since backend might not be ready
            const mockData = Array.from({ length: days }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (days - 1 - i));
                return {
                    day: d.toISOString(),
                    count: Math.floor(Math.random() * 50) + 5
                };
            });

            return {
                daily: {
                    total_users: mockData,
                    candidates: mockData.map(d => ({ ...d, count: Math.floor(d.count * 0.8) })),
                    staff: mockData.map(d => ({ ...d, count: Math.floor(d.count * 0.2) })),
                    pre_registrations: mockData.map(d => ({ ...d, count: Math.floor(d.count * 1.5) })),
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
                    conversion_percentage: 80
                }
            };
        }
    }


    static async inviteStaffMember(payload: InviteStaffMemberPayloadType): Promise<{ message: string }> {

        try {
            const response = await client.post(UserMgtUrls.inviteStaffMember, payload);
            return response.data;

        } catch (error) {
            console.error('Error inviting staff member:', error);
            throw new Error('Failed to invite staff member');
        }
    }


    static async handleVerificationStatus(user_id:string,payload:HandleVerificationStatusPayloadType){
        try {
            
            const response = await client.post(UserMgtUrls.HANDLE_VERIFICATION_STATUS(user_id), payload);
            return response.data;
        } catch (error) {
            console.error(error, 'Error handling verification status')
            throw error;
        }
    }

    static async getAccountDetails(user_id: string): Promise<StaffDetailsType> {
        try {
            const response = await client.get(UserMgtUrls.ACCOUNT_DETAILS(user_id));
            return response.data;
        } catch (error) {
            console.error(error, 'Error fetching account details')
            throw error;
        }
    }
}
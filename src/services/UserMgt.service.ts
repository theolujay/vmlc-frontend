import { UserMgtUrls } from "@/constants/UserMgtUrls";
import { InviteStaffMemberPayloadType, StaffDetailsType, UserMgtType } from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
    static async getUserList(): Promise<UserMgtType> {
        try {
            
            const response = await client.get(UserMgtUrls.getUserList);
            
            return response.data;
        } catch (error) {
            console.error(error,'Error getting list')
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


    static async inviteStaffMember(payload: InviteStaffMemberPayloadType): Promise<{ message: string }> {

        try {
            const response = await client.post(UserMgtUrls.inviteStaffMember, payload);
            return response.data;

        } catch (error) {
            console.error('Error inviting staff member:', error);
            throw new Error('Failed to invite staff member');
        }
    }

    static async getAccountDetails(user_id: string): Promise<StaffDetailsType> {
        try {
            const response = await client.get(UserMgtUrls.ACCOUNT_DETAILS(user_id));
            return response.data;
        } catch (error) {
            console.error(error,'Error fetching account details')
            throw error;
        }
    }
}
import { UserMgtUrls } from "@/constants/UserMgtUrls";
import { InviteStaffMemberPayloadType, UserMgtType } from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
    static async getUserList(): Promise<UserMgtType> {
        const response = await client.get(UserMgtUrls.getUserList);
        console.log(response,'what is the response for user list')
        return response.data;
    }


    static async getStatOverview(){
        try {
            const response=await client.get(UserMgtUrls.STATISTICS_OVERVIEW);
            console.log(response,'give me response')
            return response.data
        } catch (error) {
            console.error(error,'what is error')
            throw error;
        }
    }


    static async inviteStaffMember(payload:InviteStaffMemberPayloadType): Promise<{message:string}> {

        try {
            const response = await client.post(UserMgtUrls.inviteStaffMember, payload);
            return response.data;

        } catch (error) {
            console.error('Error inviting staff member:', error);
            throw new Error('Failed to invite staff member');
        }
    }
}
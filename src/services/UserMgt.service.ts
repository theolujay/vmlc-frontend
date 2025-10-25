import { UserMgtUrls } from "@/constants/UserMgtUrls";
import { InviteStaffMemberPayloadType, UserMgtType } from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
    static async getUserList(): Promise<UserMgtType> {
        const response = await client.get(UserMgtUrls.getUserList);
        return response.data;
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
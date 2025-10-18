import { UserMgtUrls } from "@/constants/UserMgtUrls";
import { UserMgtType } from "@/types/UserMgtType";
import client from "@/utils/axios";

export class UserMgtService {
    static async getUserList(): Promise<UserMgtType> {
        const response = await client.get(UserMgtUrls.getUserList);
        return response.data;
    }
}
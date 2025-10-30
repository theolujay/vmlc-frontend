import { BroadcastUrls } from "@/constants/broadCastUrls";
import { BroadcastType } from "@/types/BroadCastType";
import client from "@/utils/axios";

export class BroadcastMgtService {
    static async getBroadcastList(): Promise<BroadcastType | undefined> {
        try {
            const response = await client.get(BroadcastUrls.get_broadcast_list);
            return response.data;
        } catch (error) {
            console.error(error)
            return undefined
        }
    }
}
import { BroadcastUrls } from "@/constants/broadCastUrls";
import { BroadcastType, CreateBroadCastType } from "@/types/BroadCastType";
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


    static async createBroadcastMessage(payload:CreateBroadCastType){
        try { 
            const response=await client.post(BroadcastUrls.create_broadcast,payload);
            console.log(response,'what is in broadcast')
            return response.data;
        } catch (error) {
            console.error(error)
        }
    }
}
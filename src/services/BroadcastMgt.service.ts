import { BroadcastUrls } from '@/constants/broadCastUrls';
import {
  BroadcastItemType,
  BroadcastType,
  CreateBroadCastType,
} from '@/types/BroadCastType';
import client from '@/utils/axios';

export class BroadcastMgtService {
  static async getBroadcastList(): Promise<BroadcastType | undefined> {
    try {
      const response = await client.get(BroadcastUrls.get_broadcast_list);
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async getBroadcastDetail(
    id: number
  ): Promise<BroadcastItemType | undefined> {
    try {
      const response = await client.get(BroadcastUrls.get_broadcast_detail(id));
      return response.data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  static async createBroadcastMessage(payload: CreateBroadCastType) {
    try {
      const response = await client.post(
        BroadcastUrls.create_broadcast,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

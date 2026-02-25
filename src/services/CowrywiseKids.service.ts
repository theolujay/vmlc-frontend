import client from "@/utils/axios";

export class CowrywiseKidsService {
    static async createProfile(username: string) {
        try {
            const response = await client.post('/v1/cowrywise-kids/', { username });
            return response.data;
        } catch (error) {
            console.error('Error creating Cowrywise Kid profile:', error);
            throw error;
        }
    }
}

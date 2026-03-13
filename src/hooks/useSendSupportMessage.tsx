import { SupportService } from "@/services/Support.service";
import { SendMessagePayload, SupportMessageType } from "@/types/SupportType";
import { useState } from "react";

export default function useSendSupportMessage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (payload: SendMessagePayload): Promise<SupportMessageType | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await SupportService.sendMessage(payload);
            return response;
        } catch {
            setError('Failed to send message');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading, error };
}

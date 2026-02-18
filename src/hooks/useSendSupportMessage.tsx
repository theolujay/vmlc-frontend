import { SupportService } from "@/services/Support.service";
import { SendMessagePayload, SupportMessageType } from "@/types/SupportType";
import { useState } from "react";

/**
 * Hook to send a message to a support thread.
 */
export default function useSendSupportMessage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (payload: SendMessagePayload): Promise<SupportMessageType | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await SupportService.postMessage(payload);
            return response;
        } catch (_err) {
            setError('Failed to send message');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading, error };
}

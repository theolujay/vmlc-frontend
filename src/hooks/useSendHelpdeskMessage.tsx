import { HelpdeskService } from "@/services/Helpdesk.service";
import { SendMessagePayload, HelpdeskMessageType } from "@/types/HelpdeskType";
import { useState } from "react";

/**
 * Hook to send a message to a helpdesk thread.
 */
export default function useSendHelpdeskMessage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (payload: SendMessagePayload): Promise<HelpdeskMessageType | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await HelpdeskService.postMessage(payload);
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

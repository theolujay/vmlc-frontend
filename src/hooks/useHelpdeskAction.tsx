import { HelpdeskService } from "@/services/Helpdesk.service";
import { useState } from "react";
import { toast } from 'react-toastify';

export const useHelpdeskAction = () => {
    const [loading, setLoading] = useState(false);

    const performAction = async (threadId: string, status: 'closed' | 'snoozed', snoozedUntil?: string) => {
        setLoading(true);
        try {
            const payload: { status: string; snoozed_until?: string } = { status };
            if (status === 'snoozed' && snoozedUntil) {
                payload.snoozed_until = snoozedUntil;
            } else if (status === 'snoozed') {
                // Default snooze for 5 minutes if not provided
                const snoozeTime = new Date();
                snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
                payload.snoozed_until = snoozeTime.toISOString();
            }

            await HelpdeskService.performThreadAction(threadId, payload);
            toast.success(`Thread ${status} successfully`);
            return true;
        } catch (error) {
            toast.error(`Failed to ${status} thread`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { performAction, loading };
};

import { UserMgtService } from "@/services/UserMgt.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function useBulkNotification() {
  const { mutateAsync: sendBulkNotification, isPending } = useMutation({
    mutationFn: async (payload: {
      user_ids: string[];
      message: string;
      medium?: string;
      subject?: string;
    }) => {
      return UserMgtService.sendBulkNotification(payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Notifications sent successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send notifications.");
    },
  });

  return { sendBulkNotification, isPending };
}
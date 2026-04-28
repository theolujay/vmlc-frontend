import { UserMgtService } from "@/services/UserMgt.service";
import { useMutation } from "@tanstack/react-query";

export default function useBulkNotification() {
  const { mutateAsync: sendBulkNotification, isPending } = useMutation({
    mutationFn: async (payload: {
      user_ids: string[];
      subject: string;
      message: string;
      medium?: string;
    }) => {
      return UserMgtService.sendBulkNotification(payload);
    },
  });

  return { sendBulkNotification, isPending };
}
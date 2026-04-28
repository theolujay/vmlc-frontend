import { UserMgtService } from "@/services/UserMgt.service";
import { useMutation } from "@tanstack/react-query";

export default function useResetPassword() {
  const { mutateAsync: resetPassword, isPending } = useMutation({
    mutationFn: async (userId: string) => {
      return UserMgtService.resetUserPassword(userId);
    },
  });

  return { resetPassword, isPending };
}
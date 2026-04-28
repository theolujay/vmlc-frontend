import { UserMgtService } from "@/services/UserMgt.service";
import { useMutation } from "@tanstack/react-query";

export default function useExportUsers() {
  const { mutateAsync: exportUsers, isPending } = useMutation({
    mutationFn: async (filters?: Record<string, string>) => {
      const blob = await UserMgtService.exportUsers(filters);
      const url = window.URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const profile = filters?.profile || "users";
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${profile}_export_${timestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
  });

  return { exportUsers, isPending };
}
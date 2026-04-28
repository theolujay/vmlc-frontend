import { useState } from "react";
import client from "@/utils/axios";
import { UserMgtUrls } from "@/constants/UserMgtUrls";

export interface BulkImportResult {
  success: { row: number; email: string; candidate_id: string }[];
  errors: { row: number; error: string }[];
  created: number;
  failed: number;
}

export default function useBulkCandidateImport() {
  const [data, setData] = useState<BulkImportResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importCandidate = async (file: File): Promise<BulkImportResult | null> => {
    setIsPending(true);
    setError(null);
    setData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await client.post<BulkImportResult>(
        UserMgtUrls.bulkCandidateImport,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(response.data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Import failed";
      setError(message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
  };

  return {
    importCandidate,
    data,
    isPending,
    error,
    reset,
  };
}
import { ExamPortal } from '@/services/examPortal.service';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export default function useUploadExamFaceCapture() {
    const { isPending, mutate, isSuccess } = useMutation({
        mutationFn: ({ examId, file }: { examId: string; file: File }) => 
            ExamPortal.uploadExamFaceCapture(examId, file),
        onSuccess: () => {
            toast.success('Identity verified successfully.');
        },
        onError: (error: AxiosError<{ detail?: string }>) => {
            toast.error(error?.response?.data?.detail || 'Failed to upload identity verification. Please try again.');
        }
    });

    return { isPending, uploadFace: mutate, isSuccess };
}


import { ExamPortal } from '@/services/examPortal.service';
import { CreateQuestionType } from '@/types/Examtype';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';


const updateQuestionSchema = z.object({
    text: z.string().min(3, { message: 'Question text must be at least 3 characters' }),
    option_a: z.string().min(1, { message: 'Option A is required' }),
    option_b: z.string().min(1, { message: 'Option B is required' }),
    option_c: z.string().min(1, { message: 'Option C is required' }),
    option_d: z.string().min(1, { message: 'Option D is required' }),
    correct_answer: z.string().min(1, { message: 'Correct answer is required' }),
    difficulty: z.string().min(1, { message: 'Difficulty is required' }),
})

const defaultValues = {
    text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    difficulty: ''
}

export default function useUpdateQuestion(questionId: number, onSuccess: () => void, examId?: string) {
    const queryClient = useQueryClient()
    const form = useForm({
        resolver: zodResolver(updateQuestionSchema),
        defaultValues
    });

    const { isPending, mutate } = useMutation({
        mutationFn: (payload: CreateQuestionType) => ExamPortal.updateQuestion(questionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-questions'] })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            if (examId) {
                queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] })
            }
            toast.success('Question updated successfully')
            onSuccess()
        },
        onError: (error: any) => {
            console.error('Question update error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update question';
            toast.error(errorMessage);
        }
    })

    function onSubmit(payload: CreateQuestionType) {
        mutate(payload)
    }

    return { isPending, onSubmit, form }
}

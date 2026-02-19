
import { ExamPortal } from '@/services/examPortal.service';
import { CreateQuestionType } from '@/types/Examtype';
import { ApiError } from '@/types/Index';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';


const createQuestionSchema = z.object({
    text: z.string().min(3, { message: 'Question text must be at least 3 characters' }),
    image: z.any().optional(),
    option_a: z.string().min(1, { message: 'Option A is required' }),
    option_b: z.string().min(1, { message: 'Option B is required' }),
    option_c: z.string().min(1, { message: 'Option C is required' }),
    option_d: z.string().min(1, { message: 'Option D is required' }),
    correct_answer: z.string().min(1, { message: 'Correct answer is required' }),
    difficulty: z.string().min(1, { message: 'Difficulty is required' }),
})
const defaultValues = {
    text: '',
    image: null,
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: '',
    difficulty: ''
}

export default function useCreateQuestion(onSuccess: () => void, examId?: string) {
    const queryClient = useQueryClient()
    const form = useForm({
        resolver: zodResolver(createQuestionSchema),
        defaultValues
    });

    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.createQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['list-questions'] })
            queryClient.invalidateQueries({ queryKey: ['list-exams'] })
            if (examId) {
                queryClient.invalidateQueries({ queryKey: ['exam-questions', examId] })
            }
            form.reset()
            toast.success('Question created successfully')
            onSuccess()
        },
        onError: (error: unknown) => {
            console.error('Question creation error:', error);
            const apiError = error as ApiError;
            const errorMessage = apiError.response?.data?.message || (error as Error)?.message || 'Failed to create question';
            toast.error(errorMessage);
        }
    })

    function onSubmit(payload: CreateQuestionType) {
        const formData = new FormData();
        formData.append('text', payload.text);
        formData.append('option_a', payload.option_a);
        formData.append('option_b', payload.option_b);
        formData.append('option_c', payload.option_c);
        formData.append('option_d', payload.option_d);
        formData.append('correct_answer', payload.correct_answer);
        formData.append('difficulty', payload.difficulty);
        
        if (payload.image instanceof File) {
            formData.append('image', payload.image);
        } else if (payload.image === null) {
            formData.append('image', '');
        }

        if (examId) {
            formData.append('exam_ids', examId);
        } else if (payload.exam_ids) {
            payload.exam_ids.forEach(id => formData.append('exam_ids', id));
        }

        mutate(formData);
    }
    return { isPending, onSubmit, form }
}




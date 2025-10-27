
import { ExamPortal } from '@/services/examPortal.service';
import { CreateQuestionType } from '@/types/Examtype';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';


const createQuestionSchema = z.object({
    text: z.string().min(3, { message: 'Question text must be at least 3 characters' }),
    option_a: z.string().min(1, { message: 'Option A is required' }),
    option_b: z.string().min(1, { message: 'Option B is required' }),
    option_c: z.string().min(1, { message: 'Option C is required' }),
    option_d: z.string().min(1, { message: 'Option D is required' }),
    correct_answer: z.string().min(1, { message: 'Correct answer is required' }),
    difficulty: z.string().min(1, { message: 'Difficulty is required' }),
    // correct_answer:z.enum(['A','B','C','D'],{message:'Correct answer is required'}),
    // difficulty:z.enum(['easy','medium','hard'],{message:'Difficulty is required'})  
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

export default function useCreateQuestion(onSuccess: () => void) {
    const form = useForm({
        resolver: zodResolver(createQuestionSchema),
        defaultValues


    });

    const { isPending, mutate } = useMutation({
        mutationFn: ExamPortal.createQuestion,
        onSuccess: () => {
            form.reset()
            toast.success('Question created successfully')
            onSuccess()
        }
    })



    function onSubmit(payload: CreateQuestionType) {
        mutate(payload)
    }
    return { isPending, onSubmit, form }
}

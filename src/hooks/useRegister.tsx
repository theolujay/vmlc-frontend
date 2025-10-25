import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import * as z from 'zod';


const registerSchema = z.object({
    email: z.email({ message: 'Must be an email' }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string(),
    first_name: z.string().min(2,'First name field cannot be empty'),
    phone: z.string(),
    last_name: z.string().min(2,'Last name field cannot be empty'),
    school: z.string()
}).refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
});

const defaultValues = {
    email: '',
    password: '',
    password2: '',
    phone: '',
    first_name: '', last_name: '', school: ''
}

export type ValueType = z.infer<typeof registerSchema>;

export default function useRegister() {
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues
    });
    const router = useRouter()

    const { isPending, mutate } = useMutation({
        mutationFn: AuthService.registerCandidate,
        onSuccess: () => {
           
            router.push('/auth/verify')
        },
        

    })




    function onSubmit(value: ValueType) {
    
        const transformedValue: ValueType = {

            email: value.email.toLowerCase(),
            first_name: value.first_name,
            last_name: value.last_name,
            phone: value.phone,
            password: value.password,
            school: value.school,
            password2: value.password2
        }
        localStorage.setItem('email',value.email.toLowerCase())
    
        mutate(transformedValue);
    }


    return { form, onSubmit, isPending }
}

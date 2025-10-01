import { AuthService } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from 'react-hook-form';
import * as z from 'zod';


const registerSchema = z.object({
    email: z.email({ message: 'Must be an email' }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password2: z.string(),
    first_name: z.string(),
    phone: z.string(),
    last_name: z.string(),
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

    const { isPending, mutate } = useMutation({
        mutationFn: AuthService.register,
        onSuccess: (value) => console.log(value, 'this is success value'),
        onError: (errorValue) => console.log(errorValue, 'what is error value')

    })




    function onSubmit(value: ValueType) {
        console.log(value)
        // const transformedValue: RegisterRequest = {
        //     user: {
        //         email: value.email.toLowerCase(),
        //         first_name: value.first_name,
        //         last_name: value.last_name,
        //         phone: value.phone

        //     },
        //     password: value.password,
        //     school: value.school,
        //     password2: value.password2
        // }
        mutate(value)
        // mutate(transformedValue);
    }


    return { form, onSubmit, isPending }
}

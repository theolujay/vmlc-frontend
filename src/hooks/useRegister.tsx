import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from 'zod';


const registerSchema = z.object({
    email: z.email(),
    password: z.string(),
    confirmPassword: z.string(),
    fname: z.string(),
    phone:z.string(),
    lname: z.string(),
    school: z.string()
})

const defaultValues = {
    email: '',
    password: '',
    confirmPassword: '',
    phone:'',
    fname: '', lname: '', school: ''
}

type ValueType=z.infer<typeof registerSchema>;

export default function useRegister() {
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues
    });

    function onSubmit(value:ValueType){
        console.log(value)
    }


    return {form,onSubmit}
}

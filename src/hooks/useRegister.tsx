import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as z from 'zod';


// const registerSchema = z.object({
//     email: z.email({ message: 'Must be an email' }),
//     password: z.string().min(8, "Password must be at least 8 characters").optional(),
//     password2: z.string().optional(),
//     first_name: z.string().min(2,'First name field cannot be empty'),
//     phone: z.string(),
//     last_name: z.string().min(2,'Last name field cannot be empty'),
//     school: z.string(),
//     generate_password:z.boolean()
// }).refine((data) => data.password === data.password2, {
//     path: ["password2"],
//     message: "Passwords do not match",
// });

const registerSchema = z
  .object({
    email: z.string().email({ message: 'Must be a valid email' }),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    // terms:z.boolean(),
    terms: z.boolean().refine(val => val === true, {
  message: 'You must accept the terms and conditions',
}),
    password2: z.string().optional(),
    first_name: z.string().min(2, 'First name field cannot be empty'),
    phone: z.string(),
    last_name: z.string().min(2, 'Last name field cannot be empty'),
    school_name: z.string().min(2, 'School field cannot be empty'),
    generate_password: z.boolean()
  })
  .superRefine((data, ctx) => {
    if (!data.generate_password) {
      // If auto-generate is FALSE, both passwords are required
      if (!data.password) {
        ctx.addIssue({
          path: ['password'],
          message: 'Password is required when auto-generate is off',
          // code:z.
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.password2) {
        ctx.addIssue({
          path: ['password2'],
          message: 'Confirm password is required when auto-generate is off',
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.password && data.password2 && data.password !== data.password2) {
        ctx.addIssue({
          path: ['password2'],
          message: 'Passwords do not match',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });


  export type ValueType = z.infer<typeof registerSchema>;
const defaultValues:ValueType = {
    email: '',
    password: '',
    password2: '',
    phone: '',
    first_name: '', last_name: '', school_name: '',
    generate_password:false,
    terms:false,
}


export default function useRegister() {
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues,
        mode: 'onChange',
  shouldUnregister: true, 
    });
    const router = useRouter()

    const { isPending, mutate } = useMutation({
        mutationFn: AuthService.registerCandidate,
        onSuccess: () => {
            toast.success("Registration successful")
            form.reset()
            router.push('/login')
        },
        onError:(error:AxiosError<any>)=>{
          toast.error(error?.response?.data.detail||'Registration was not successful')
        }
        

    })




    function onSubmit(value: ValueType) {
    // console.log(value,'what is in value')
        const transformedValue = {

            email: value.email.toLowerCase(),
            first_name: value.first_name,
            last_name: value.last_name,
            phone: value.phone,
            password: value.password,
            school_name: value.school_name,
            password2: value.password2,
            generate_password:value.generate_password
        }
        localStorage.setItem('email',value.email.toLowerCase())
  //  alert( JSON.stringify(transformedValue))
        mutate(transformedValue);
    }


    return { form, onSubmit, isPending }
}

import { useAuth } from "@/contexts/AuthProvider";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  remember: z.boolean().optional()
})

type LoginType = z.infer<typeof loginSchema>;

export default function useLogin() {
  const { dispatch } = useAuth()
  
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('remembered_email');
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    
    if (rememberedEmail) {
      form.setValue('email', rememberedEmail);
    }
    if (rememberMe) {
      form.setValue('remember', true);
    }
  }, [form]);

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: LoginType) => {
      const { remember, ...loginData } = variables;
      return AuthService.login(loginData);
    },
    onSuccess: (value, variables) => {
      // Handle Remember Me logic
      if (variables.remember) {
        localStorage.setItem('remembered_email', variables.email);
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('remember_me');
      }
    
      setTimeout(() => {
        dispatch({ type: 'loginSuccess', payload: value });
      }, 1000)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError:(error:AxiosError<any>)=>{
      toast.error(error?.response?.data.detail||'Encountered error logging in')
    }
  })

  function onSubmit(value: LoginType) {
    mutate(value)
  }

  return { form, onSubmit, isPending }
}

import { useAuth } from "@/contexts/AuthProvider";
import { AuthService } from "@/services/auth.service";
import { isDev } from "@/utils/isDev";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string()
})

const defaultValues = {
  email: '',
  password: ''
}

type LoginType = z.infer<typeof loginSchema>;



export default function useLogin() {
  const { dispatch } = useAuth()
  const form = useForm({
    resolver: zodResolver(loginSchema),
     defaultValues: isDev() ? { email: 'david@verboheit.org', password: 'zaq1wsxcde' } : defaultValues
    //  defaultValues: isDev() ? { email: 'afobajedavid@gmail.com', password: '@Medievaltimes123' } : defaultValues
    // defaultValues: isDev() ? { email: 'ikukoyidave@gmail.com', password: 'IloveRice12@' } : defaultValues
  });

  const { isPending, mutate } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (value) => {

    
      setTimeout(() => {
        dispatch({ type: 'loginSuccess', payload: value });
      }, 1000)
    },
    onError:(error:AxiosError<any>)=>{
      
      toast.error(error?.response?.data.detail||'Encountered error logging in')
    }

  })


  function onSubmit(value: LoginType) {
    // const payload = {
    //   email: value.email,
    //   password: value.password,
    // }
    // mutate(payload)
    mutate(value)
  }


  return { form, onSubmit, isPending }

}

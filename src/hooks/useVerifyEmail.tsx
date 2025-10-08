import { AuthService } from '@/services/auth.service';
import { VerifyRequest } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';
import useGetCurrentUser from './useGetCurrentUser';



const verifySchema=z.object({
    // email:z.email(),
 otp: z.string().min(6, 'OTP must be 6 digits'),
  
})

type VerifySchema = z.infer<typeof verifySchema>;
export default function useVerifyEmail() {
    const currentUser=useGetCurrentUser();
    const defaultValues={
       
        // email:currentUser?.profile.user.email,
        otp:''
    }
  const form=useForm({
    resolver:zodResolver(verifySchema),
    defaultValues
  });


  const {isPending,mutate}=useMutation({
    mutationFn:AuthService.verifyEmail,
    onSuccess:(value)=>{
        console.log(value)
    }
  })


  function onSubmit(value:VerifySchema){
    if (!currentUser) {
        throw new Error('No user')
    }
    const payload={
        email:currentUser.profile.user.email,
        otp:value.otp
    }
    console.log(payload,'what is payload here')
    mutate(payload)
  }

  return {form,onSubmit,isPending}
}

import { AuthService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';
import useGetCurrentUser from './useGetCurrentUser';



const verifySchema = z.object({
  // email:z.email(),
  otp: z.string().min(6, 'OTP must be 6 digits'),

})

type VerifySchema = z.infer<typeof verifySchema>;
export default function useVerifyEmail() {
  const currentUser = useGetCurrentUser();
  const defaultValues = {
    otp: ''
  }
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues
  });


  const { isPending, mutate } = useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: (value) => {
      console.log(value)
    }
  })


  const { mutate: resendMutate, isPending: resendPending } = useMutation({
    mutationFn: AuthService.resendOtp,
    onSuccess: (value) => console.log(value)
  })

  function onSubmit(value: VerifySchema) {
    if (!currentUser) {
      throw new Error('No user')
    }
    const payload = {
      email: currentUser.profile.user.email,
      otp: value.otp
    }
    
    mutate(payload)
  }

  function resendOtpFunction() {
    if (!currentUser) {
      throw new Error('No user')
    }
    const payload = {
      email: currentUser.profile.user.email
    }
    resendMutate(payload)

  }

  return { form, onSubmit, isPending, resendOtpFunction, resendPending }
}

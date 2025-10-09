import { AuthService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import z from 'zod';



const verifySchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),

})

type VerifySchemaType = z.infer<typeof verifySchema>;
export default function useVerifyEmail() {
  const currentUserEmail = localStorage.getItem('email');
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

  function onSubmit(value: VerifySchemaType) {
    if (!currentUserEmail) {
      throw new Error('Kindly register to proceed')
    }
    const payload = {
      email: currentUserEmail,
      otp: value.otp
    }
    
    mutate(payload)
  }

  function resendOtpFunction() {
    if (!currentUserEmail) {
      throw new Error('Kindly register to proceed')
    }
    const payload = {
      email: currentUserEmail
    }
    resendMutate(payload)

  }

  return { form, onSubmit, isPending, resendOtpFunction, resendPending }
}

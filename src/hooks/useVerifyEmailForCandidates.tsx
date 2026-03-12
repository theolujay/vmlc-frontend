import { AuthService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';



const verifySchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),

})

type VerifySchemaType = z.infer<typeof verifySchema>;
export default function useVerifyEmailForCandidates(onSuccessCallback: () => void, userEmail?: string) {
  


  
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
      toast.success('Otp verified successfully')
      // localStorage.removeItem('email');
      onSuccessCallback()

    },
    onError: () => {
      toast.error('Failed to verify otp')
    }
  })


  const { mutate: resendMutate, isPending: resendPending } = useMutation({
    mutationFn: AuthService.resendOtp,

  })

  function onSubmit(value: VerifySchemaType) {
    if (!userEmail) {
      throw new Error('Kindly register to proceed')
    }
    const payload = {
      email: userEmail,
      otp: value.otp
    }
    
    mutate(payload)
  }

  function resendOtpFunction() {
    if (!userEmail) {
      throw new Error('Kindly register to proceed')
    }
    const payload = {
      email: userEmail,
      resend: true
    }
    resendMutate(payload)

  }

  return { form, onSubmit, isPending, resendOtpFunction, resendPending }
}

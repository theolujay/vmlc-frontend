import { AuthService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';



const verifySchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),

})

type VerifySchemaType = z.infer<typeof verifySchema>;
export default function useVerifyEmailForCandidates(onSuccessCallback: () => void, userEmail?: string) {
  // const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);


  const router = useRouter()
  // ✅ Load email from localStorage only on client side
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setCurrentUserEmail(localStorage.getItem('email'));
  //   }
  // }, []);
  // const currentUserEmail = localStorage.getItem('email');
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

      // localStorage.removeItem('email');
      onSuccessCallback()

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
    console.log(payload, 'what did i get')
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

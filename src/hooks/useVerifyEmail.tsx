import { AuthService } from '@/services/auth.service';
import { ApiError } from '@/types/Index';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';



const verifySchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),

})

type VerifySchemaType = z.infer<typeof verifySchema>;
export default function useVerifyEmail() {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);


  const router = useRouter()
  // ✅ Load email from localStorage only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserEmail(localStorage.getItem('email'));
    }
  }, []);
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

      localStorage.removeItem('email');
      toast.success(value.message || 'Email verified successfully');
      router.push('/login')
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || 'An error occurred. Please try again.');
    }
  })


  const { mutate: resendMutate, isPending: resendPending } = useMutation({
    mutationFn: AuthService.resendOtp,

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

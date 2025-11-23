
"use client"
import useEmailCountdown from '@/hooks/useEmailCountdown'
import useVerifyEmail from '@/hooks/useVerifyEmail'
import { formatTime } from '@/utils/formatTime'
import { maskEmail } from '@/utils/maskEmail'
import { FormProvider } from 'react-hook-form'
import AuthButton from '../ui/Button'
import { OTP } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import AuthLayout from './Layout/Layout'
import { useEffect, useState } from 'react'



export default function EmailVerification() {

const [currentUserEmail, setCurrentUserEmail] = useState<string|null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('email');
    if (stored) {
      setCurrentUserEmail(stored);
    }
  }, []);




//  const currentUserEmail = localStorage.getItem('email');
    
    const {timer, setTimer} = useEmailCountdown()
    
    const { onSubmit, form, isPending, resendOtpFunction, resendPending } = useVerifyEmail()
    const otpValue = form.watch('otp');

    const isOtpComplete = !!otpValue && otpValue.length === 6;
    // const handleSubmit = () => setTab('reset')


    
    const handleResend = async () => {
        resendOtpFunction() // triggers mutation
        setTimer(120) // restart timer after resend
    }
    return (
        <AuthLayout>
            <div className="flex flex-col md:w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] w-full bg-[#FFFFFF99]">


                    <div className="flex flex-col w-full ">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="flex gap-1 items-center flex-col">
                                <h2 className='text-[28px] font-[700]'>Email Verification</h2>
                                <p>Please we have sent an instruction email to <strong>{maskEmail(currentUserEmail?? '')}</strong>, including a one-time password (OTP). Kindly input the one-time password (OTP).</p>
                            </div>
                            <FormProvider {...form}>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                    <div className="flex w-full">
                                        <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                    </div>






                                    <div className="grid mt-6">
                                      

                                        <AuthButton
                                            disabled={!isOtpComplete || isPending}
                                            isPending={isPending}
                                        >
                                            {isPending ? <Spinner /> : 'verify and continue'}
                                        </AuthButton>

                                    </div>
                                    <div className="flex flex-col gap-3 items-center mt-6">



                                        {timer > 0 ? (
                                            <span>Resend OTP in <strong className='p-2 rounded-lg bg-white'>
                                                {formatTime(timer)}

                                            </strong></span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={resendPending}
                                                className="text-[#3E4095] font-semibold hover:underline disabled:text-gray-400"
                                            >
                                                {resendPending ? 'Sending...' : 'Resend OTP'}
                                            </button>
                                        )}


                                    </div>
                                </form>
                            </FormProvider>
                        </div>

                    </div>
                </div>
            </div>


        </AuthLayout>
    )
}

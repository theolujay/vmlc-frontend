
"use client"
import useGetCurrentUser from '@/hooks/useGetCurrentUser'
import useVerifyEmail from '@/hooks/useVerifyEmail'
import { maskEmail } from '@/utils/maskEmail'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'
import AuthButton from '../ui/Button'
import { OTP } from '../ui/Input'
import AuthLayout from './Layout/Layout'
import Spinner from '../ui/spinner/spinner'
import { useEffect, useState } from 'react'
import { formatTime } from '@/utils/formatTime'



export default function EmailVerification() {

    const currentUser = useGetCurrentUser()
    const [timer, setTimer] = useState(120)
    console.log(currentUser, 'what is here from verify form')
    const { onSubmit, form, isPending, resendOtpFunction, resendPending } = useVerifyEmail()
    const otpValue = form.watch('otp');

    const isOtpComplete = !!otpValue && otpValue.length === 6;
    // const handleSubmit = () => setTab('reset')


    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleResend = async () => {
        resendOtpFunction() // triggers mutation
        setTimer(60) // restart timer after resend
    }
    return (
        <AuthLayout>
            <div className="flex flex-col w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] w-full bg-[#FFFFFF99]">


                    <div className="flex flex-col w-full ">
                        <div className="flex flex-col gap-3 items-center">
                            <div className="flex gap-1 items-center flex-col">
                                <h2 className='text-[28px] font-[700]'>Email Verification</h2>
                                <p>Please we have sent an instruction email to <strong>{maskEmail(currentUser?.profile?.user.email ?? '')}</strong>, including a one-time password (OTP). Kindly input the one-time password (OTP).</p>
                            </div>
                            <FormProvider {...form}>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                    <div className="flex w-full">
                                        <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                    </div>






                                    <div className="grid mt-6">
                                        {/* <AuthButton isPending={!isOtpComplete||isPending}
                                    // onClick={handleSubmit}
                                    >{isPending?<Spinner/>:'verify and continue'}</AuthButton>
                                     */}

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


                                        {/* <div className='flex flex-col items-center gap-2'>
                                        <div className="">
                                            <span>Resend OTP In </span>
                                            <Link href='/'>01:56</Link>
                                        </div>
                                    </div> */}
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

"use client";
import React from 'react'
import AppDialog from '../ui/Modals/AppDialog'
import { FormProvider } from 'react-hook-form'
import { OTP } from '../ui/Input'
import AuthButton from '../ui/Button'
import { formatTime } from '@/utils/formatTime'
import useEmailCountdown from '@/hooks/useEmailCountdown'
import useVerifyEmailForCandidates from '@/hooks/useVerifyEmailForCandidates'
import { maskEmail } from '@/utils/maskEmail'
import Spinner from '../ui/spinner/spinner'
export default function EmailVerificationModal({ open, close, currentUserEmail}: Readonly<{ open: boolean, close: (close: boolean) => void ,currentUserEmail?:string}>) {



   const {timer, setTimer} = useEmailCountdown()
    function handleClose() {
        close(false)
    }
    const { onSubmit, form, isPending, resendOtpFunction, resendPending } = useVerifyEmailForCandidates(handleClose,currentUserEmail)
    const otpValue = form.watch('otp');

    const isOtpComplete = !!otpValue && otpValue.length === 6;


      const handleResend = async () => {
        resendOtpFunction() // triggers mutation
        setTimer(120) // restart timer after resend
    }
    // const handleSubmit = () => setTab('reset')
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md p-6 flex-col w-full ">
                {/* <ResponsiveContainer> */}

                <div className="flex flex-col gap-3 items-center">
                    <div className="flex gap-1 items-center flex-col">
                        <h2 className='text-[28px] font-[700]'>Email Verification</h2>
                        <p>Please we have sent an instruction email to <strong>{maskEmail(currentUserEmail ?? '')}</strong>, including a one-time password (OTP). Kindly input the one-time password (OTP).</p>
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
                {/* </ResponsiveContainer> */}

            </div>
        </AppDialog>
    )
}

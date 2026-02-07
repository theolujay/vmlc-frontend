"use client"
import useEmailCountdown from '@/hooks/useEmailCountdown'
import useVerifyEmail from '@/hooks/useVerifyEmail'
import { formatTime } from '@/utils/formatTime'
import { maskEmail } from '@/utils/maskEmail'
import { FormProvider } from 'react-hook-form'
import { OTP } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import AuthLayout from './Layout/Layout'
import { useEffect, useState, useCallback } from 'react'
import clsx from 'clsx'

export default function EmailVerification() {
    const [currentUserEmail, setCurrentUserEmail] = useState<string|null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('email');
        if (stored) {
            setCurrentUserEmail(stored);
        }
    }, []);

    const { timer, setTimer } = useEmailCountdown()
    const { onSubmit, form, isPending, resendOtpFunction, resendPending } = useVerifyEmail()
    const otpValue = form.watch('otp');
    const isOtpComplete = !!otpValue && otpValue.length === 6;

    const handleResend = useCallback(async () => {
        resendOtpFunction() // triggers mutation
        setTimer(120) // restart timer after resend
    }, [resendOtpFunction, setTimer])

    return (
        <AuthLayout>
            <div className="flex-1 flex flex-col items-center justify-center p-4 font-sans">
                <div className="flex bg-[#F7F9FC] rounded-[2.5rem] flex-col overflow-hidden border border-white/20 shadow-2xl max-w-md w-full mx-auto">
                    <div className="header bg-white p-8 border-b border-gray-50 text-center">
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-16 h-16 bg-[#3E4095]/5 rounded-[1.5rem] flex items-center justify-center text-[#3E4095] mb-2 shadow-inner">
                                <i className="fas fa-envelope-open-text text-3xl"></i>
                            </div>
                            <h2 className='text-2xl font-black text-gray-800 tracking-tight uppercase'>Verification</h2>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed max-w-[90%] mx-auto">
                            We have sent a secure code to <strong className="text-gray-800">{maskEmail(currentUserEmail ?? '')}</strong>. Please enter the code below to proceed.
                        </p>
                    </div>

                    <div className="p-8">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                                <div className="flex justify-center py-2">
                                    <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type='submit'
                                        disabled={!isOtpComplete || isPending}
                                        className={clsx(
                                            "w-full px-6 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3",
                                            (!isOtpComplete || isPending) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                        )}
                                    >
                                        {isPending ? <Spinner /> : (
                                            <>
                                                <span>Verify & Continue</span>
                                                <i className="fas fa-arrow-right text-[10px]"></i>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex flex-col items-center gap-3 mt-1">
                                        {timer > 0 ? (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resend in</span>
                                                <span className="text-[10px] font-black text-[#3E4095]">{formatTime(timer)}</span>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResend}
                                                disabled={resendPending}
                                                className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline disabled:text-gray-300 transition-all"
                                            >
                                                {resendPending ? 'Sending...' : 'Resend OTP Code'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}
"use client";
import React, { useCallback } from 'react'
import AppDialog from '../ui/Modals/AppDialog'
import { FormProvider } from 'react-hook-form'
import { OTP } from '../ui/Input'
import { formatTime } from '@/utils/formatTime'
import useEmailCountdown from '@/hooks/useEmailCountdown'
import useVerifyEmailForCandidates from '@/hooks/useVerifyEmailForCandidates'
import { maskEmail } from '@/utils/maskEmail'
import Spinner from '../ui/spinner/spinner'
import clsx from 'clsx'

export default function EmailVerificationModal({ open, close, currentUserEmail}: Readonly<{ open: boolean, close: (close: boolean) => void ,currentUserEmail?:string}>) {
    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { timer, setTimer } = useEmailCountdown()
    const { onSubmit, form, isPending, resendOtpFunction, resendPending } = useVerifyEmailForCandidates(handleClose, currentUserEmail)
    const otpValue = form.watch('otp');
    const isOtpComplete = !!otpValue && otpValue.length === 6;

    const handleResend = async () => {
        resendOtpFunction() // triggers mutation
        setTimer(120) // restart timer after resend
    }

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
                <div className="header bg-white p-6 sm:p-8 border-b border-gray-50 text-center">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095] mb-4">
                            <i className="fas fa-envelope-open-text text-3xl"></i>
                        </div>
                        <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>Security Verification</p>
                        <h2 className='text-2xl font-bold text-gray-800 tracking-tight uppercase'>Email Verification</h2>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[80%] mx-auto">
                        We have sent a one-time password (OTP) to <strong className="text-gray-800">{maskEmail(currentUserEmail ?? '')}</strong>. Please enter the code below to verify your account.
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                            <div className="flex justify-center py-4">
                                <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    type='submit'
                                    disabled={!isOtpComplete || isPending}
                                    className={clsx(
                                        "w-full px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                        (!isOtpComplete || isPending) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                    )}
                                >
                                    {isPending ? <Spinner /> : (
                                        <>
                                            <span>Verify & Continue</span>
                                            <i className="fas fa-arrow-right text-[8px]"></i>
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-col items-center gap-3 mt-2">
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
                                            {resendPending ? 'Sending Code...' : 'Resend Verification Code'}
                                        </button>
                                    )}
                                    
                                    <button 
                                        type="button"
                                        onClick={handleClose}
                                        className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                    >
                                        Use a different email address
                                    </button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AppDialog>
    )
}

"use client"
import useForgotPassword from '@/hooks/useForgotPassword'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { FormProvider } from 'react-hook-form'
import Input, { ConfirmPasswordInput, OTP, PasswordInput } from '../ui/Input'
import { MailIcon, PasswordIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import Spinner from '../ui/spinner/spinner'
import { maskEmail } from '@/utils/maskEmail'
import { formatTime } from '@/utils/formatTime'
import useEmailCountdown from '@/hooks/useEmailCountdown'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

type TabType = 'forgot' | 'reset' | 'newPassword' | 'done'

export default function ForgotPassword() {
    const router = useRouter()
    const { timer, setTimer } = useEmailCountdown()
    const [tab, setTab] = useState<TabType>('forgot')

    const { sendEmailForm,
        isPending,
        onEmailSubmit,
        otpPending,
        otpForm,
        submitOtpForPasswordChange,
        setNewPasswordForm,
        handleNewPasswordChange,
        setNewPasswordPending, email, setEmail,
        resendPending,
        resendOtpFunction
    } = useForgotPassword({
        onEmailSuccess: () => setTab('reset'),
        onOtpSuccess: () => setTab('newPassword'),
        onPasswordSuccess: () => setTab('done')
    })

    const handleResend = useCallback(async () => {
        resendOtpFunction()
        setTimer(120)
    }, [resendOtpFunction, setTimer])

    return (
        <AuthLayout>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
                <div className="flex bg-[#F7F9FC] rounded-[2.5rem] flex-col overflow-hidden border border-white/20 shadow-2xl max-w-lg w-full mx-auto">
                    
                    <div className="bg-white px-10 pt-10 pb-6 border-b border-gray-50 relative">
                        <div className="flex gap-2 mb-8">
                            {(['forgot', 'reset', 'newPassword', 'done'] as TabType[]).map((t, i) => (
                                <div 
                                    key={t} 
                                    className={clsx(
                                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                                        tab === t ? "bg-[#3E4095] shadow-[0_0_8px_rgba(62,64,149,0.3)]" : 
                                        (['forgot', 'reset', 'newPassword', 'done'].indexOf(tab) > i ? "bg-[#3E4095]/20" : "bg-gray-100")
                                    )} 
                                />
                            ))}
                        </div>

                        <Tabs.Root value={tab} onValueChange={(v) => setTab(v as TabType)} className="w-full">
                            <Tabs.Content value='forgot' className="outline-none animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095] mb-4">
                                        <i className="fas fa-key text-2xl"></i>
                                    </div>
                                    {/* <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>Password Recovery</p> */}
                                    <h2 className='text-2xl font-black text-gray-800 tracking-tight uppercase'>Forgot Password?</h2>
                                    <p className="text-[11px] text-gray-500 font-medium mt-2 leading-relaxed">Please enter your email and we&apos;ll send an OTP to reset it</p>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value='reset' className="outline-none animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095] mb-4">
                                        <i className="fas fa-envelope-open-text text-2xl"></i>
                                    </div>
                                    {/* <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>Verification</p> */}
                                    <h2 className='text-2xl font-black text-gray-800 tracking-tight uppercase'>Check Your Mail</h2>
                                    <p className="text-[11px] text-gray-500 font-medium mt-2 leading-relaxed">
                                        We sent a code to <strong className="text-gray-800">{maskEmail(email)}</strong>
                                    </p>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value='newPassword' className="outline-none animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095] mb-4">
                                        <i className="fas fa-shield-alt text-2xl"></i>
                                    </div>
                                    <h2 className='text-2xl font-black text-gray-800 tracking-tight uppercase'>Set New Password</h2>
                                    <p className="text-[11px] text-gray-500 font-medium mt-2 leading-relaxed">Please make it different from previous ones.</p>
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value='done' className="outline-none animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                                        <i className="fas fa-check-circle text-2xl"></i>
                                    </div>
                                    <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>Success</p>
                                    <h2 className='text-2xl font-black text-gray-800 tracking-tight uppercase'>All Done!</h2>
                                    <p className="text-[11px] text-gray-500 font-medium mt-2 leading-relaxed">Your password has been successfully reset. You can now login.</p>
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>

                    <div className="p-10">
                        <Tabs.Root value={tab} className="w-full">
                            <Tabs.Content value='forgot' className="outline-none">
                                <FormProvider {...sendEmailForm}>
                                    <form onSubmit={sendEmailForm.handleSubmit(async (data) => {
                                        onEmailSubmit(data)
                                        setEmail(data.email)
                                    })} className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-1.5">
                                            <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Email Address</label>
                                            <Input 
                                                name='email' 
                                                label=''
                                                icon={<MailIcon />} 
                                                placeholder='' 
                                                className='!rounded-2xl !py-4 border-gray-200' 
                                            />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                className="w-full px-6 py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                            >
                                                {isPending ? <Spinner /> : <><span>Reset Password</span><i className="fas fa-arrow-right text-[10px]"></i></>}
                                            </button>
                                            <Link href='/login' className='text-center text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline mt-2'>Back to Login</Link>
                                        </div>
                                    </form>
                                </FormProvider>
                            </Tabs.Content>

                            <Tabs.Content value='reset' className="outline-none">
                                <FormProvider {...otpForm}>
                                    <form onSubmit={otpForm.handleSubmit(async (data) => {
                                        submitOtpForPasswordChange(data)
                                    })} className="flex flex-col gap-8">
                                        <div className="flex justify-center py-2">
                                            <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <button
                                                type="submit"
                                                disabled={otpPending}
                                                className="w-full px-6 py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                            >
                                                {otpPending ? <Spinner /> : <><span>Verify Code</span><i className="fas fa-arrow-right text-[10px]"></i></>}
                                            </button>
                                            
                                            <div className="grid grid-cols-2 justify-items-center gap-4 mt-2">
                                                {timer > 0 ? (
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        Resend in <strong className='text-[#3E4095] ml-1'>{formatTime(timer)}</strong>
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleResend}
                                                        disabled={resendPending}
                                                        className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline disabled:text-gray-300"
                                                    >
                                                        {resendPending ? 'Sending...' : 'Resend Code'}
                                                    </button>
                                                )}
                                                <Link href='/login' className='text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Back to Login</Link>
                                            </div>
                                        </div>
                                    </form>
                                </FormProvider>
                            </Tabs.Content>

                            <Tabs.Content value='newPassword' className="outline-none">
                                <FormProvider {...setNewPasswordForm}>
                                    <form onSubmit={setNewPasswordForm.handleSubmit((data) => {
                                        handleNewPasswordChange(data)
                                    })} className="flex flex-col gap-6">
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>New Password</label>
                                                <PasswordInput name='new_password' label='' icon={<PasswordIcon />} placeholder='Create a password' />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Confirm Password</label>
                                                <ConfirmPasswordInput name='confirm_password' label='' icon={<PasswordIcon />} placeholder='Confirm your password' />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 mt-4">
                                            <button
                                                type="submit"
                                                disabled={setNewPasswordPending}
                                                className="w-full px-6 py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                            >
                                                {setNewPasswordPending ? <Spinner /> : <><span>Update Password</span><i className="fas fa-check-circle text-[10px]"></i></>}
                                            </button>
                                            <Link href='/login' className='text-center text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Back to Login</Link>
                                        </div>
                                    </form>
                                </FormProvider>
                            </Tabs.Content>

                            <Tabs.Content value='done' className="outline-none">
                                <div className="flex flex-col gap-6">
                                    <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100/50">
                                        <p className="text-sm text-green-800 font-medium leading-relaxed text-center italic">
                                            &quot;Your account security is our priority. Please keep your new password confidential.&quot;
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="w-full px-6 py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                        >
                                            <span>Return to Login</span>
                                            <i className="fas fa-sign-in-alt text-[10px]"></i>
                                        </button>
                                        <Link href='/' className='text-center text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Go to Homepage</Link>
                                    </div>
                                </div>
                            </Tabs.Content>
                        </Tabs.Root>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}
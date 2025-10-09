"use client"
import useForgotPassword from '@/hooks/useForgotPassword'
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import AuthButton from '../ui/Button'
import Input, { ConfirmPasswordInput, OTP, PasswordInput } from '../ui/Input'
import { DoneIcon, MailIcon, PasswordIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import Spinner from '../ui/spinner/spinner'
import { maskEmail } from '@/utils/maskEmail'
import { formatTime } from '@/utils/formatTime'
import useEmailCountdown from '@/hooks/useEmailCountdown'
import { useRouter } from 'next/navigation'


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
    } = useForgotPassword()



    const handleResend = async () => {
        resendOtpFunction() 
        setTimer(120) 
    }
    
    return (
        <AuthLayout>
            <div className="flex flex-col w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] w-full bg-[#FFFFFF99]">


                    <div className="flex flex-col w-full ">
                        <Tabs.Root
                            defaultValue='forgot'
                            className='flex gap-3 flex-col'
                            value={tab} onValueChange={(value: string) => setTab(value as TabType)}
                        >
                            <Tabs.List className='flex gap-4 justify-between'>
                                <Tabs.Trigger value='forgot' className='h-1 w-1/4 bg-gray-300 data-[state=active]:bg-[#01ACEA]'>
                                    {/* <div className=" h-2 w-1/4 bg-[#01ACEA]">klooppok</div> */}
                                </Tabs.Trigger>
                                <Tabs.Trigger value='reset' className='h-1 w-1/4 bg-gray-300 data-[state=active]:bg-[#01ACEA]'>

                                </Tabs.Trigger>
                                <Tabs.Trigger value='newPassword' className='h-1 w-1/4 bg-gray-300 data-[state=active]:bg-[#01ACEA]'>

                                </Tabs.Trigger>
                                <Tabs.Trigger value='done' className='h-1 w-1/4 bg-gray-300 data-[state=active]:bg-[#01ACEA]'>

                                </Tabs.Trigger>
                            </Tabs.List>


                            <Tabs.Content value='forgot'>
                                <div className="flex  flex-col">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>Forgot password?</h2>
                                        <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p>
                                    </div>
                                    <FormProvider {...sendEmailForm}>
                                        <form onSubmit={sendEmailForm.handleSubmit(async (data) => {
                                            onEmailSubmit(data)
                                            setEmail(data.email)
                                            setTab('reset')
                                        })} className="form-wrapper flex flex-col gap-2">


                                            <div className="grid">
                                                <Input name='email' icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
                                            </div>


                                            <div className="grid mt-6">
                                                <AuthButton
                                                    isPending={isPending}
                                                // onClick={handleSubmit}
                                                >{isPending ? <Spinner /> : 'Reset Password'}</AuthButton>
                                            </div>
                                            <div className="flex flex-col gap-3 items-center mt-6">
                                                <div className='flex gap-2'>

                                                    <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                                </div>
                                            </div>
                                        </form>
                                    </FormProvider>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value='reset'>
                                <div className="flex flex-col gap-3 items-center">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>Password Reset</h2>
                                        <p>We sent a code to {maskEmail(email)}</p>
                                    </div>
                                    <FormProvider {...otpForm}>

                                        <form onSubmit={otpForm.handleSubmit(async (data) => {

                                            submitOtpForPasswordChange(data)
                                            setTab('newPassword')
                                        })} className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                            <div className="flex w-full">
                                                <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                            </div>


                                            <div className="grid mt-6">
                                                <AuthButton
                                                    isPending={otpPending}
                                                // onClick={handleSubmit}
                                                >{otpPending ? <Spinner /> : 'continue'}</AuthButton>
                                            </div>
                                            <div className="flex flex-col gap-3 items-center mt-6">
                                                <div className='flex flex-col items-center gap-2'>
                                                    <div className="">
                                                        <span>{`Didn’t`} receive any email? </span>
                                                        {/* <Link href='/'>Click Here to Resend in 01:56s</Link> */}











                                                        {timer > 0 ? (
                                                            <span>Click here to resend OTP in <strong className='p-2 rounded-lg bg-white'>
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

                                                    <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                                </div>
                                            </div>
                                        </form>
                                    </FormProvider>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value='newPassword'>

                                <div className="flex  flex-col">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-700]'>Set New password?</h2>
                                        <p>Password must be at least 8 characters.</p>
                                        {/* <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p> */}
                                    </div>
                                    <FormProvider {...setNewPasswordForm}>

                                        <form onSubmit={setNewPasswordForm.handleSubmit((data) => {
                                            handleNewPasswordChange(data)
                                            setTab('done')
                                        })} className="form-wrapper flex flex-col gap-2">


                                            <div className="grid">
                                                <PasswordInput name='new_password' icon={<PasswordIcon />} label='CREATE NEW PASSWORD' placeholder='Create your password' className='border-[#D0D5DD]' />
                                            </div>

                                            <div className="grid">
                                                <ConfirmPasswordInput name='confirm_password' icon={<PasswordIcon />} label='CONFIRM NEW PASSWORD' placeholder='Confirm your password' className='border-[#D0D5DD]' />
                                            </div>

                                            <div className="grid mt-6">
                                                <AuthButton
                                                    isPending={setNewPasswordPending}
                                                // onClick={handleSubmit}
                                                >{setNewPasswordPending ? <Spinner /> : 'Set New Password'}</AuthButton>
                                            </div>
                                            <div className="flex flex-col gap-3 items-center mt-6">
                                                <div className='flex gap-2'>

                                                    <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                                </div>
                                            </div>
                                        </form>
                                    </FormProvider>
                                </div>

                            </Tabs.Content>
                            <Tabs.Content value='done'>

                                <div className="flex gap-5 flex-col">
                                    <div className="flex items-center justify-center  mt-4 w-full h-16 bg-[#CCEEFB]">
                                        <span className='mt-14'> <DoneIcon /></span>
                                    </div>
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>All Done</h2>
                                        <p>Your password has been reset. You can click the GO TO LOGIN button below to login.</p>
                                        {/* <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p> */}
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2">
                                        <div className="grid mt-6">
                                            <AuthButton
                                                onClick={function () {
                                                    router.push('auth/login')
                                                }}
                                            >Go to Login</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex gap-2'>

                                                <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO TO HOME</Link>
                                            </div>
                                        </div>
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

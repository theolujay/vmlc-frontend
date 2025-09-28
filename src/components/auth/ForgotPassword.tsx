"use client"
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { useState } from 'react'
import AuthButton from '../ui/Button'
import Input, { OTP, PasswordInput } from '../ui/Input'
import { DoneIcon, MailIcon, PasswordIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'


type TabType = 'forgot' | 'reset' | 'newPassword' | 'done'
export default function ForgotPassword() {
    const [tab, setTab] = useState<TabType>('forgot')


    // const handleSubmit = () => setTab('reset')
    return (
        <AuthLayout>
            <div className="flex flex-col w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] w-full bg-[#FFFFFF99]">


                    <div className="flex flex-col w-full ">
                        <Tabs.Root
                        defaultValue='forgot'
                        className='flex gap-3 flex-col'
                        // value={tab} onValueChange={(value:string)=>setTab(value as TabType)}
                        >
                            <Tabs.List className='flex gap-4 justify-between'>
                                <Tabs.Trigger value='forgot' className='h-1 w-1/4 bg-[#01ACEA]'>
                                    {/* <div className=" h-2 w-1/4 bg-[#01ACEA]">klooppok</div> */}
                                </Tabs.Trigger>
                                <Tabs.Trigger value='reset'  className='h-1 w-1/4 bg-[#01ACEA]'>
                                    
                                </Tabs.Trigger>
                                <Tabs.Trigger value='newPassword'  className='h-1 w-1/4 bg-[#01ACEA]'>
                                    
                                </Tabs.Trigger>
                                <Tabs.Trigger value='done'  className='h-1 w-1/4 bg-[#01ACEA]'>
                                    
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value='forgot'>
                                <div className="flex  flex-col">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>Forgot password?</h2>
                                        <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p>
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2">


                                        <div className="grid">
                                            <Input name='email' icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
                                        </div>


                                        <div className="grid mt-6">
                                            <AuthButton
                                            // onClick={handleSubmit}
                                            >Reset Password</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex gap-2'>

                                                <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value='reset'>
                                <div className="flex flex-col gap-3 items-center">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>Password Reset</h2>
                                        <p>We sent a code to ikukoyidave@gmail.com</p>
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                        <div className="flex w-full">
                                            <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                        </div>


                                        <div className="grid mt-6">
                                            <AuthButton
                                            // onClick={handleSubmit}
                                            >continue</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex flex-col items-center gap-2'>
                                                <div className="">
                                                    <span>Didn’t receive any email? </span>
                                                    <Link href='/'>Click Here to Resend in 01:56s</Link>
                                                </div>

                                                <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value='newPassword'>

                                <div className="flex  flex-col">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-700]'>Set New password?</h2>
                                        <p>Password must be at least 8 characters.</p>
                                        {/* <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p> */}
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2">


                                        <div className="grid">
                                            <PasswordInput name='password' icon={<PasswordIcon />} label='CREATE NEW PASSWORD' placeholder='Create your password' className='border-[#D0D5DD]' />
                                        </div>

                                        <div className="grid">
                                            <PasswordInput name='confirmPassword' icon={<PasswordIcon />} label='CONFIRM NEW PASSWORD' placeholder='Confirm your password' className='border-[#D0D5DD]' />
                                        </div>

                                        <div className="grid mt-6">
                                            <AuthButton
                                            // onClick={handleSubmit}
                                            >Set New Password</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex gap-2'>

                                                <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </Tabs.Content>
                              <Tabs.Content value='done'>

                                <div className="flex gap-5 flex-col">
                                    <div className="flex items-center justify-center  mt-4 w-full h-16 bg-[#CCEEFB]">
                                        <span className='mt-14'> <DoneIcon/></span>
                                    </div>
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>All Done</h2>
                                        <p>Your password has been reset. You can click the GO TO LOGIN button below to login.</p>
                                        {/* <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p> */}
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2">
                                        <div className="grid mt-6">
                                            <AuthButton
                                            // onClick={handleSubmit}
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

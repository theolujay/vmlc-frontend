"use client"
import * as Tabs from '@radix-ui/react-tabs'
import Link from 'next/link'
import { useState } from 'react'
import AuthButton from '../ui/AuthButton'
import Input, { OTP } from '../ui/Input'
import { MailIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'


type TabType='forgot' | 'reset' | 'newPassword' | 'done'
export default function ForgotPassword() {
    const [tab, setTab] = useState<TabType>('forgot')


    // const handleSubmit = () => setTab('reset')
    return (
        <AuthLayout>
            <div className="flex flex-col w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] bg-[#FFFFFF99]">

                    {/* <div className="flex gap-1 items-center flex-col">
          <h2 className='text-[28px] font-700]'>Forgot password?</h2>
          <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p>
        </div> */}
                    {/* <div className="form-wrapper flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input label='FIRST NAME' placeholder='Input first name (e.g John)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
            <Input label='LAST NAME' placeholder='Input last name (e.g Doe)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
          </div>
          <div className="grid">
            <PhoneNumberInput placeholder='+234 810 000 0000' className='border-[#D0D5DD]' label='PHONE NUMBER' />
          </div>
          <div className="grid">
            <Input icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <Input icon={<SchoolIcon />} label='SCHOOL' placeholder="Input your school (e.g King's college, Yaba, Lagos)" className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <PasswordInput icon={<PasswordIcon />} label='PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <PasswordInput icon={<PasswordIcon />} label='CONFIRM PASSWORD' placeholder='Confirm your password' className='border-[#D0D5DD]' />
          </div>
           <div className="grid mt-6">
            <AuthButton>Register</AuthButton>
          </div>
           <div className="flex flex-col gap-3 items-center mt-6">
           <p>By registering, you agree to {`VMLC’s`} <Link href='/' className='text-[#018ABB]'>Terms & conditions</Link> and <Link href='/' className='text-[#018ABB]'>Privacy Policy</Link></p>
           <div className='flex gap-2'>
           <span>Have an account?</span>
           <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>LOGIN</Link>
           </div>
          </div>
        </div> */}
                    <div className="flex flex-col">
                        <Tabs.Root 
                        // value={tab} onValueChange={(value:string)=>setTab(value as TabType)}
                        >
                            <Tabs.List>
                                <Tabs.Trigger value='forgot'>
                                    Forgot
                                </Tabs.Trigger>
                                <Tabs.Trigger value='reset'>
                                    Reset
                                </Tabs.Trigger>
                                <Tabs.Trigger value='newPassword'>
                                    New Password
                                </Tabs.Trigger>
                                <Tabs.Trigger value='done'>
                                    Forgot
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Tabs.Content value='forgot'>
                                <div className="flex  flex-col">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-700]'>Forgot password?</h2>
                                        <p>Rest assured, we will send you a reset instruction email, including a one-time password (OTP).</p>
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2">


                                        <div className="grid">
                                            <Input icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
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
                                        <h2 className='text-[28px] font-700]'>Password Reset</h2>
                                        <p>We sent a code to ikukoyidave@gmail.com</p>
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                        <div className="flex w-full">
                                            <OTP  label='Enter OTP' className='border-[#D0D5DD]' />
                                        </div>


                                        <div className="grid mt-6">
                                            <AuthButton 
                                            // onClick={handleSubmit}
                                            >continue</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex gap-2'>

                                                <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>GO BACK TO LOGIN</Link>
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

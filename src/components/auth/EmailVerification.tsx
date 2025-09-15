

import Link from 'next/link'
import AuthButton from '../ui/AuthButton'
import { OTP } from '../ui/Input'
import AuthLayout from './Layout/Layout'



export default function EmailVerification() {
    

    // const handleSubmit = () => setTab('reset')
    return (
        <AuthLayout>
            <div className="flex flex-col w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
                <div className="flex flex-col p-5 rounded-[12px] w-full bg-[#FFFFFF99]">


                    <div className="flex flex-col w-full ">
                        <div className="flex flex-col gap-3 items-center">
                                    <div className="flex gap-1 items-center flex-col">
                                        <h2 className='text-[28px] font-[700]'>Email Verification</h2>
                                        <p>Please we have sent an instruction email to joh...oe@gmail.com, including a one-time password (OTP). Kindly input the one-time password (OTP).</p>
                                    </div>
                                    <div className="form-wrapper flex flex-col gap-2 w-5/6 justify-center">


                                        <div className="flex w-full">
                                            <OTP label='Enter OTP' className='border-[#D0D5DD]' />
                                        </div>


                                        <div className="grid mt-6">
                                            <AuthButton
                                            // onClick={handleSubmit}
                                            >verify and continue</AuthButton>
                                        </div>
                                        <div className="flex flex-col gap-3 items-center mt-6">
                                            <div className='flex flex-col items-center gap-2'>
                                                <div className="">
                                                    <span>Resend OTP In </span>
                                                    <Link href='/'>01:56</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                      
                    </div>
                </div>
            </div>


        </AuthLayout>
    )
}

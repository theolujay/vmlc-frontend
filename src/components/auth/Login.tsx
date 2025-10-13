"use client"
import useLogin from '@/hooks/useLogin'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'
import AuthButton from '../ui/Button'
import Input, { PasswordInput } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import { MailIcon, PasswordIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'

export default function Login() {
  const { form, onSubmit, isPending } = useLogin()
  return (
    <AuthLayout>
      <div className="flex flex-col lg:w-[50%] h-screen gap-3 items-center justify-center mx-auto p-4 ">
        <div className="flex flex-col p-5 rounded-[12px] bg-[#FFFFFF99]">

          <div className="flex gap-1 items-center flex-col">
            <h2 className='text-[28px] font-700]'>Candidate portal login</h2>
            <p>Enter your credentials to access your account</p>
          </div>
          <FormProvider {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="form-wrapper flex flex-col gap-2">

              <div className="grid">
                <Input name='email' icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
              </div>

              <div className="grid">
                <PasswordInput name='password' icon={<PasswordIcon />} label='PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
              </div>
              <div className="flex justify-between">
                <div className="checkbox flex gap-1 items-center">
                  <input type="checkbox" name="" id="checkbox" />
                  <label htmlFor="checkbox">Remember me</label>
                </div>
                <Link href='/auth/forgot-password' className='text-[#3E4095]'>Forgot Password?</Link>
              </div>

              <div className="grid mt-6">
                <AuthButton isPending={isPending}>{isPending ? <Spinner /> : 'Login'}</AuthButton>
              </div>
              <div className="flex flex-col gap-3 items-center mt-6">

                <div className='flex gap-2'>
                  <span>{`Don't`} have an account?</span>
                  <Link href='/auth/login' className=' text-[#3E4095] font-[700]'>REGISTER</Link>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>


    </AuthLayout>
  )
}

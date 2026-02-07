"use client"
import useLogin from '@/hooks/useLogin'
import Link from 'next/link'
import { FormProvider } from 'react-hook-form'
import { NeutralInput, OrdinaryPasswordInput } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import { MailIcon, PasswordIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import config from '../../../config'
import clsx from 'clsx'

const landingUrl = config.LANDING_URL

export default function Login() {
  const { form, onSubmit, isPending } = useLogin()
  
  return (
    <AuthLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 font-sans">
        <div className="flex bg-[#F7F9FC] rounded-[2.5rem] flex-col overflow-hidden border border-white/20 shadow-2xl max-w-md w-full mx-auto">
          <div className="header bg-white p-8 border-b border-gray-50 text-center">
            <div className="flex flex-col items-center gap-1 mb-4 text-center">
              <div className="w-16 h-16 bg-[#3E4095]/5 rounded-[1.5rem] flex items-center justify-center text-[#3E4095] mb-2 shadow-inner">
                <i className="fas fa-user-shield text-3xl"></i>
              </div>

              <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase mb-1">
                Welcome
              </h2>

              <p className="text-[10px] text-gray-500 font-medium tracking-widest leading-relaxed">
                Verboheit Mathematics League Competition Portal
              </p>
            </div>

          </div>

          <div className="p-8">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1'>
                    <i className="fas fa-envelope text-[#3E4095]"></i>
                    Email Address
                  </label>
                  <NeutralInput 
                    name='email'
                    label=''
                    icon={<MailIcon />} 
                    placeholder='' 
                    className='!rounded-2xl !py-3 !px-5 border-gray-200 focus:border-[#3E4095] transition-all' 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center px-1">
                    <label htmlFor="password" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                      <i className="fas fa-lock text-[#3E4095]"></i>
                      Password
                    </label>
                    <Link href='/auth/forgot-password' title="Forgot Password" icon-name="forgot-password" className='text-[9px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Forgot?</Link>
                  </div>
                  <OrdinaryPasswordInput 
                    name='password' 
                    label=''
                    icon={<PasswordIcon />} 
                    className='!rounded-2xl !py-3 !px-5 border-gray-200 focus:border-[#3E4095] transition-all' 
                  />
                </div>

                <div className="flex items-center justify-between px-1 mt-1">
                  <div className="flex gap-2 items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      {...form.register('remember')}
                      className="w-3.5 h-3.4 rounded-lg border-gray-300 text-[#3E4095] focus:ring-[#3E4095]/20 cursor-pointer" 
                    />
                    <label htmlFor="remember" className="text-[10px] font-bold text-gray-500 cursor-pointer group-hover:text-gray-700 transition-colors uppercase tracking-tight">Remember me</label>
                  </div>
                </div>

                <div className="grid mt-2">
                  <button
                    type='submit'
                    disabled={isPending}
                    className={clsx(
                      "w-full px-6 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3",
                      isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                    )}
                  >
                    {isPending ? <Spinner /> : (
                      <>
                        <span>Login</span>
                        <i className="fas fa-arrow-right text-[10px]"></i>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col items-center mt-4 pt-4 border-t border-gray-100">
                  <div className='flex items-center gap-2'>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">{`Don't`} have an account?</span>
                    <a href={`${landingUrl}/register`} className='text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Register Now</a>
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

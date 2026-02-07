"use client"
import useIsRegistrationAvailable from '@/hooks/useIsRegistrationAvailable'
import useRegister from '@/hooks/useRegister'
import Link from 'next/link'
import { Controller, FormProvider } from 'react-hook-form'
import { Checkbox } from '../ui/Checkbox'
import Input, { ConfirmPasswordInput, PasswordInput, PhoneNumberInput } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import { MailIcon, PasswordIcon, PersonIcon, SchoolIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import RegistrationClosed from './RegistrationClosed'
import clsx from 'clsx'

export default function Register() {
  const { form, onSubmit, isPending } = useRegister()
  const autoGenerate = form.watch('generate_password')
  const { isRegistrationAvailable, isRegPending } = useIsRegistrationAvailable()
  
  return (
    <AuthLayout>
      {isRegPending ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : isRegistrationAvailable?.is_candidate_reg_open ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 font-sans">
          <div className="flex bg-[#F7F9FC] rounded-[2rem] flex-col overflow-hidden border border-white/20 shadow-2xl max-w-xl w-full mx-auto">
            <div className="header bg-white p-6 border-b border-gray-50 text-center">
              <div className="flex flex-col items-center mb-3">
                <div className="w-14 h-14 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095] mb-2 shadow-inner">
                  <i className="fas fa-user-plus text-3xl"></i>
                </div>
                <h2 className='text-xl font-black text-gray-800 tracking-tight uppercase'>Registration</h2>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Create your participant account.</p>
            </div>

            <div className="p-6">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>First Name</label>
                      <Input name='first_name' label='' placeholder='' className='!rounded-xl !py-2 border-gray-200' icon={<PersonIcon />} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Last Name</label>
                      <Input name='last_name' label='' placeholder='' className='!rounded-xl !py-2 border-gray-200' icon={<PersonIcon />} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Phone Number</label>
                      <PhoneNumberInput name='phone' label='' placeholder='' className='!rounded-xl !py-2 border-gray-200' />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Email Address</label>
                      <Input name='email' label='' icon={<MailIcon />} placeholder='' className='!rounded-xl !py-2 border-gray-200' />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>School Name & Location</label>
                    <Input name='school_name' label='' icon={<SchoolIcon />} placeholder="" className='!rounded-xl !py-2 border-gray-200' />
                  </div>

                  <div className="flex justify-end px-1">
                    <div className="flex items-center gap-2 group cursor-pointer">
                      <Controller 
                        name='generate_password' 
                        control={form.control} 
                        render={({ field }) => (
                          <Checkbox 
                            checked={field.value} 
                            id='generate' 
                            onChange={(e) => field.onChange(e)} 
                          />
                        )} 
                      />
                      <label className='text-[10px] font-bold text-[#01ACEA] cursor-pointer uppercase tracking-tight' htmlFor="generate">Auto-Generate Password</label>
                    </div>
                  </div>

                  {!autoGenerate && (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex flex-col gap-1">
                        <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Password</label>
                        <PasswordInput name='password' label='' icon={<PasswordIcon />} placeholder='' className='!rounded-xl !py-2 border-gray-200' />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Confirm Password</label>
                        <ConfirmPasswordInput name='password2' label='' icon={<PasswordIcon />} placeholder='' className='!rounded-xl !py-2 border-gray-200' />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 px-1 mt-1">
                    <div className="flex gap-2 items-start">
                      <div className="mt-0.5 scale-90 origin-top-left">
                        <Controller
                          name='terms'
                          control={form.control}
                          render={({ field }) => (
                            <Checkbox 
                              checked={field.value} 
                              id='terms' 
                              onChange={(e) => field.onChange(e)} 
                            />
                          )} 
                        />
                      </div>
                      <label htmlFor='terms' className="text-[10px] text-gray-500 leading-snug">
                        I accept {`VMLC's`} 
                        <Link href='/VMLC T&C.pdf' target='_blank' className='text-[#3E4095] font-bold mx-1 hover:underline'>Terms</Link> 
                        & 
                        <Link href='/VMLC Privacy Policy.pdf' target='_blank' className='text-[#3E4095] font-bold mx-1 hover:underline'>Privacy Policy</Link>.
                      </label>
                    </div>
                    {form.formState.errors.terms && (
                      <p className="text-red-500 text-[9px] font-bold uppercase px-1">
                        {form.formState.errors.terms.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid mt-2">
                    <button 
                      disabled={!form.formState.isValid || isPending} 
                      className={clsx(
                        "w-full px-6 py-3.5 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3",
                        (!form.formState.isValid || isPending) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                      )}
                    >
                      {isPending ? <Spinner /> : <><span>Register</span><i className="fas fa-arrow-right text-[9px]"></i></>}
                    </button>
                  </div>

                  <div className="flex flex-col items-center mt-3 pt-3 border-t border-gray-100">
                    <div className='flex items-center gap-2'>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Already registered?</span>
                      <Link href='/login' className='text-[10px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Login here</Link>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      ) : (
        <RegistrationClosed mail={isRegistrationAvailable?.support_email} profile_type="candidate" />
      )}
    </AuthLayout>
  )
}
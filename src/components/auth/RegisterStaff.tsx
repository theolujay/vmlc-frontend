"use client"
import useRegisterStaff from '@/hooks/useRegisterStaff'
import Link from 'next/link'
import { Controller, FormProvider } from 'react-hook-form'
import Input, { ConfirmPasswordInput, PasswordInput, PhoneNumberInput } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import { MailIcon, OccupationIcon, PasswordIcon, PersonIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import { Checkbox } from '../ui/Checkbox'
import useIsRegistrationAvailable from '@/hooks/useIsRegistrationAvailable'
import RegistrationClosed from './RegistrationClosed'
import clsx from 'clsx'

export default function RegisterStaff() {
  const { form, onSubmit, isPending } = useRegisterStaff()
  const { isRegistrationAvailable, isRegPending } = useIsRegistrationAvailable()
  
  return (
    <AuthLayout>
      {isRegPending ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner />
        </div>
      ) : isRegistrationAvailable?.is_staff_reg_open ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
          <div className="flex bg-[#F7F9FC] rounded-[2.5rem] flex-col overflow-hidden border border-white/20 shadow-2xl max-w-2xl w-full mx-auto">
            <div className="header bg-white p-10 border-b border-gray-50 text-center">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-[#3E4095]/5 rounded-[2rem] flex items-center justify-center text-[#3E4095] mb-4 shadow-inner">
                  <i className="fas fa-user-tie text-4xl"></i>
                </div>
                <p className='text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2'>Volunteer Application</p>
                <h2 className='text-3xl font-black text-gray-800 tracking-tight uppercase'>Staff Registration</h2>
              </div>
              <p className="text-[12px] text-gray-500 font-medium">Enter your credentials to join our team of volunteers.</p>
            </div>

            <div className="p-10">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>First Name</label>
                      <Input name='first_name' label='' placeholder='John' className='!rounded-2xl !py-4 border-gray-200' icon={<PersonIcon />} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Last Name</label>
                      <Input name='last_name' label='' placeholder='Doe' className='!rounded-2xl !py-4 border-gray-200' icon={<PersonIcon />} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Phone Number</label>
                      <PhoneNumberInput name='phone' label='' placeholder='+234 810 000 0000' className='!rounded-2xl !py-4 border-gray-200' />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Email Address</label>
                      <Input name='email' label='' icon={<MailIcon />} placeholder='johndoe@gmail.com' className='!rounded-2xl !py-4 border-gray-200' />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Occupation / Role</label>
                    <Input name='occupation' label='' icon={<OccupationIcon />} placeholder="Teacher / Software Engineer" className='!rounded-2xl !py-4 border-gray-200' />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Password</label>
                      <PasswordInput name='password' label='' icon={<PasswordIcon />} placeholder='••••••••' className='!rounded-2xl !py-4 border-gray-200' />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest px-1'>Confirm Password</label>
                      <ConfirmPasswordInput name='password2' label='' icon={<PasswordIcon />} placeholder='••••••••' className='!rounded-2xl !py-4 border-gray-200' />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-1 mt-2">
                    <div className="flex gap-3 items-start">
                      <div className="mt-1">
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
                      <label htmlFor='terms' className="text-[11px] text-gray-500 leading-relaxed">
                        I agree to allow my information to be used for promotional purposes and accept {`VMLC's`} 
                        <Link href='/VMLC T&C.pdf' target='_blank' className='text-[#3E4095] font-bold mx-1 hover:underline'>Terms & Conditions</Link> 
                        and 
                        <Link href='/VMLC Privacy Policy.pdf' target='_blank' className='text-[#3E4095] font-bold mx-1 hover:underline'>Privacy Policy</Link>.
                      </label>
                    </div>
                  </div>

                  <div className="grid mt-4">
                    <button 
                      type="submit"
                      disabled={!form.formState.isValid || isPending} 
                      className={clsx(
                        "w-full px-6 py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] uppercase text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3",
                        (!form.formState.isValid || isPending) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                      )}
                    >
                      {isPending ? <Spinner /> : <><span>Apply for Membership</span><i className="fas fa-arrow-right text-[10px]"></i></>}
                    </button>
                  </div>

                  <div className="flex flex-col items-center mt-6 pt-6 border-t border-gray-100">
                    <div className='flex items-center gap-2'>
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-tight">Already have a staff account?</span>
                      <Link href='/login' className='text-[11px] font-black text-[#3E4095] uppercase tracking-widest hover:underline'>Login here</Link>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      ) : (
        <RegistrationClosed mail={isRegistrationAvailable?.support_email} profile_type="volunteer" />
      )}
    </AuthLayout>
  )
}

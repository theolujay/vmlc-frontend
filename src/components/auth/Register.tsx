"use client"
import useIsRegistrationAvailable from '@/hooks/useIsRegistrationAvailable'
import useRegister from '@/hooks/useRegister'
import Link from 'next/link'
import { Controller, FormProvider } from 'react-hook-form'
import AuthButton from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import Input, { ConfirmPasswordInput, PasswordInput, PhoneNumberInput } from '../ui/Input'
import Spinner from '../ui/spinner/spinner'
import { MailIcon, PasswordIcon, PersonIcon, SchoolIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import RegistrationClosed from './RegistrationClosed'





export default function Register() {

  const { form, onSubmit, isPending } = useRegister()
  const autoGenerate = form.watch('generate_password')
  const { isRegistrationAvailable,isRegPending } = useIsRegistrationAvailable()
  
  return (
    <AuthLayout>
    
      {
         isRegPending?<div className="flex items-center justify-center min-h-[60vh]">
      <Spinner />
    </div>:
      
      isRegistrationAvailable?.is_candidate_reg_open
      ?  <div className="flex flex-col lg:w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
        <div className="flex flex-col p-5 rounded-[12px] bg-[#FFFFFF99]">

          <div className="flex gap-1 items-center flex-col">
            <h2 className='text-[18px] md:text-[28px] font-bold'>Candidate Registration</h2>
            <p>Enter your details to get started</p>

          </div>
          <FormProvider {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="form-wrapper flex flex-col gap-2">
              <div className="grid lg:grid-cols-2 gap-2">
                <Input name='first_name' label='FIRST NAME' placeholder='John' className='border-[#D0D5DD]' icon={<PersonIcon />} />
                <Input name='last_name' label='LAST NAME' placeholder='Doe' className='border-[#D0D5DD]' icon={<PersonIcon />} />
              </div>
              <div className="grid">
                <PhoneNumberInput name='phone' placeholder='+234 810 000 0000' className='border-[#D0D5DD]' label='PHONE NUMBER' />
              </div>
              <div className="grid">
                <Input name='email' icon={<MailIcon />} label='EMAIL' placeholder='johndoe@gmail.com' className='border-[#D0D5DD]' />
              </div>
              <div className="grid">
                <Input name='school_name' icon={<SchoolIcon />} label='SCHOOL' placeholder="King's college, Yaba, Lagos" className='border-[#D0D5DD]' />
              </div>


              <div className="flex justify-end items-end">
                <div className="flex items-center gap-1">
                  <Controller name='generate_password' control={form.control} render={({ field }) => <Checkbox checked={field.value} id='generate' onChange={(e) => {
                    field.onChange(e)
                    // handleCheckbox(e)
                  }} />} />


                  <label className='font-semibold text-[#01ACEA]' htmlFor="generate">Generate Password for me</label>
                </div>
              </div>

              {
                !autoGenerate && <>


                  <div className="grid">
                    <PasswordInput name='password' icon={<PasswordIcon />} label='PASSWORD' placeholder='Create a password' className='border-[#D0D5DD]' />
                  </div>
                  <div className="grid">
                    <ConfirmPasswordInput name='password2' icon={<PasswordIcon />} label='CONFIRM PASSWORD' placeholder='Confirm your password' className='border-[#D0D5DD]' />
                  </div>
                </>
              }
              {/* <div className="grid">
                <div className="flex items-center gap-1">
                  <Controller name='generate_password' control={form.control} render={({field})=><Checkbox checked={field.value} id='generate' onChange={(e)=>{
                    field.onChange(e)
                    // handleCheckbox(e)
                    }}/>} />
               
                
                 <label  className='font-semibold text-[#01ACEA]' htmlFor="generate">Generate Password for me</label>
             </div>
              </div> */}
              <div className="flex flex-col">

                <div className="flex gap-3 items-center mt-6">


                  <Controller
                    name='terms'
                    control={form.control}
                    render={({ field }) => <Checkbox checked={field.value} id='terms' onChange={(e) => {
                      field.onChange(e)
                    }} />} />
                  <label htmlFor='terms'>I agree to allow my information to be used for promotional purposes and accept {`VMLC's`} <Link href='/VMLC T&C.pdf' target='_blank' className='text-[#018ABB]'>Terms & Conditions</Link> and <Link href='/VMLC Privacy Policy.pdf' target='_blank' className='text-[#018ABB]'>Privacy Policy</Link>.</label>

                </div>
                {form.formState.errors.terms && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.terms.message as string}
                  </p>
                )}
              </div>
              <div className="grid mt-6">
                <AuthButton disabled={!form.formState.isValid || isPending} isPending={isPending}>{isPending ? <Spinner /> : 'Register'}</AuthButton>
              </div>
              <div className="flex flex-col gap-3 items-center mt-6">

                <div className='flex gap-2'>
                  <span>Have an account?</span>
                  <Link href='/login' className=' text-[#3E4095] font-[700]'>LOGIN</Link>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      :
      <RegistrationClosed mail={isRegistrationAvailable?.support_email} profile_type="candidate" />
      }
    </AuthLayout>
  )
}
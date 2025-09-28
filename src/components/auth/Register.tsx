"use client"
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import AuthButton from '../ui/Button'
import Input, { PasswordInput, PhoneNumberInput } from '../ui/Input'
import { MailIcon, PasswordIcon, PersonIcon, SchoolIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'
import z from 'zod'
import useRegister from '@/hooks/useRegister'


// const registerSchema = z.object({
// email:z.email(),
// password:z.string(),
// confirmPassword:z.string(),
// fname:z.string(),
// lname:z.string(),
// school:z.string()
// })

export default function Register() {
  // const methods = useForm({
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //     fname: '', lname: '', school: ''
  //   }
  // })
  const {form,onSubmit}=useRegister()
  return (
    <AuthLayout>


      <div className="flex flex-col md:w-[50%] gap-3 items-center justify-center mx-auto p-4 ">
        <div className="flex flex-col p-5 rounded-[12px] bg-[#FFFFFF99]">

          <div className="flex gap-1 items-center flex-col">
            <h2 className='text-[28px] font-bold'>Welcome to the candidate portal!</h2>
            <p>Enter your credentials to register as a candidate</p>
          </div>
          <FormProvider {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className="form-wrapper flex flex-col gap-2">
              <div className="grid md:grid-cols-2 gap-2">
                <Input name='fname' label='FIRST NAME' placeholder='Input first name (e.g John)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
                <Input name='lname' label='LAST NAME' placeholder='Input last name (e.g Doe)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
              </div>
              <div className="grid">
                <PhoneNumberInput name='phone' placeholder='+234 810 000 0000' className='border-[#D0D5DD]' label='PHONE NUMBER' />
              </div>
              <div className="grid">
                <Input name='email' icon={<MailIcon />} label='EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
              </div>
              <div className="grid">
                <Input name='school' icon={<SchoolIcon />} label='SCHOOL' placeholder="Input your school (e.g King's college, Yaba, Lagos)" className='border-[#D0D5DD]' />
              </div>
              <div className="grid">
                <PasswordInput name='password' icon={<PasswordIcon />} label='PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
              </div>
              <div className="grid">
                <PasswordInput name='confirmPassword' icon={<PasswordIcon />} label='CONFIRM PASSWORD' placeholder='Confirm your password' className='border-[#D0D5DD]' />
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
            </form>
          </FormProvider>
        </div>
      </div>



    </AuthLayout>
  )
}

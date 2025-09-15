
import AuthButton from '../ui/AuthButton'
import Input, { PasswordInput, PhoneNumberInput } from '../ui/Input'
import { MailIcon, PasswordIcon, PersonIcon, SchoolIcon } from '../ui/SvgAsset/GeneralAsset'
import AuthLayout from './Layout/Layout'

export default function Login() {
  return (
    <AuthLayout>
      <div className="flex flex-col w-[50%] items-center justify-center mx-auto p-4 ">
        <div className="form-wrapper flex flex-col gap-2">
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
        </div>
      </div>


    </AuthLayout>
  )
}

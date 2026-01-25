import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { AccountCreationIcon, EmailVerificationIcon, LockedIcon } from '@/components/ui/SvgAsset/GeneralAsset';
import React, { useState } from 'react'
import { ExamsIcon } from './GettingStartedAssets';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import useGetAccountMgt from '@/hooks/useGetAccountMgt';
import EmailVerificationModal from '@/components/Modals/EmailVerificationModal';
import useSendOtp from '@/hooks/useSendOtp';
// import EmailVerificationModal from '@/components/Modals/EmailVerificationModal';


export default function InfoBoard() {

  const [openEmail, setOpenEmail] = useState(false)
  const { authState } = useAuth()
  const router = useRouter()
  const { data } = useGetAccountMgt()



  function handleOpenEmailVerification() {
    onSubmit({ email: authState!.user!.email! })
    setOpenEmail(true)
  }


  const { onSubmit } = useSendOtp();


  function handleOverview() {
    if (authState?.userType == 'candidate') {
      router.push('/exam-portal')
    }
    else if (authState?.userType == 'staff') {
      router.push('/admin/overview')
    }
  }

  const stepsCompleted = [
    true, // account creation always done
    data?.user.is_email_verified,
    false, // exams not yet participated
  ].filter(Boolean).length;
  const totalSteps = 3;
  const completionPercentage = Math.round((stepsCompleted / totalSteps) * 100);



  return (
    <ResponsiveContainer className=' gap-2 md:col-span-2'>
      <div className='flex justify-between '>
        <div className="flex-col gap-0.5">
          <p className='text-[28px] font-[700]'>Welcome, {authState?.user?.first_name}</p>

          <p className="text-[14px]">{`You're`} only two steps away from becoming a candidate! {`Here's`} what we need from you.</p>
        </div>
        <div className='flex justify-between gap-2'> <span> <CircularProgress progress={completionPercentage} />{" "}</span><span className='text-[#01ACEA]'>{completionPercentage}% completed</span></div>
      </div>
      <div className="flex flex-col gap-10">
        
        {/* <button onClick={handleOpenEmailVerification} className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center  border-[#E4E7EC]"><span>Verify Email</span></button> */}
        <InfoItem isApproved buttons={<button className="cta font-bold text-[#099137]  border-[#E7F6EC] border   bg-[#E7F6EC] p-2 rounded-lg">Completed</button>} icon={<AccountCreationIcon />} label='Initiate Account Creation' desc='Register a candidate account with your basic information.' />
        <InfoItem isApproved={data?.user?.is_email_verified} buttons={data?.user?.is_email_verified ? <button className="cta font-bold text-[#099137]  border-[#E7F6EC] border   bg-[#E7F6EC] p-2 rounded-lg">Email Verified</button> : <button onClick={handleOpenEmailVerification} className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center  border-[#E4E7EC]"><span>Verify Email</span></button>} icon={<EmailVerificationIcon />} label='Email Verification' desc='Verify your registered email address.' />
        <InfoItem buttons={[<button onClick={handleOverview} disabled={!data?.is_active} key='button-one' className={clsx("cta p-2 rounded-lg inline-flex justify-between gap-1 border items-center ", data?.is_active ? ' cursor-pointer ' : 'text-[#475367] bg-[#E4E7EC]  border-[#E4E7EC]')}><span>Go to Overview</span></button>, <button key='button-two' className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Await Exams</span></button>]} icon={<ExamsIcon />} label='Participate in Exams' desc='Participate in exams on due date.' />
      </div>
      <EmailVerificationModal currentUserEmail={authState?.user?.email} open={openEmail} close={setOpenEmail} />
    </ResponsiveContainer>
  )
}



export function InfoItem({ icon, label, desc, buttons, isApproved = false }: Readonly<{ icon: React.ReactNode, label: string, desc: string, buttons: React.ReactNode | React.ReactNode[], isApproved?: boolean }>) {
  return (
    <div className='flex justify-between items-center'>
      <div className="flex gap-2">
        <span className="icon">{icon}</span>
        <div className="flex flex-col ">
          <p className={clsx('font-bold ', isApproved && 'line-through')}>{label}</p>
          <p className={clsx('text-sm', isApproved && 'line-through')}>{desc}</p>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {Array.isArray(buttons) ? buttons.map((button: React.ReactNode, index: number) => <span key={`button-${index}`}>{button}</span>) : buttons}

      </div>
    </div>
  )
}




type CircularProgressProps = {
  size?: number;        // diameter of the circle
  strokeWidth?: number; // thickness of the ring
  progress: number;     // 0–100 percentage
};

function CircularProgress({
  size = 25,
  strokeWidth = 3,
  progress,
}: Readonly<CircularProgressProps>) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size}>
      {/* background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#CCEEFB"
        fill="none"
        strokeWidth={strokeWidth}
      />

      {/* progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#01ACEA" // deep blue color
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // start at top
      />

      {/* optional percentage text */}
      {/* <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fill="#007bff"
      >
        {`${Math.round(progress)}%`}
      </text> */}
    </svg>
  );
}

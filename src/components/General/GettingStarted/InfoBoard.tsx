import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { AccountCreationIcon, LockedIcon } from '@/components/ui/SvgAsset/GeneralAsset';
import React from 'react'
import { ApprovalIcon, ExamsIcon, VerificationIcon } from './GettingStartedAssets';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

export default function InfoBoard() {
    // const userName = 'Ezekiel';
    const {authState}=useAuth()

const router=useRouter()
    function handleVerification(){
router.push('/get-started/verification')
    }
    return (
        <ResponsiveContainer className=' gap-2 md:col-span-2'>
            <div className='flex justify-between '>
                <div className="flex-col gap-0.5">
                    <p className='text-[28px] font-[700]'>Welcome, {authState?.user?.first_name}</p>
                    <p className="text-[14px]">{`You're`} only three steps away from becoming a verified candidate! {`Here's`} what we need from you.</p>
                </div>
                <div><span className='text-[#01ACEA]'>25% completed</span></div>
            </div>
            <div className="flex flex-col gap-10">
                <InfoItem buttons={<button className="cta font-bold text-[#099137] bg-[#E7F6EC] p-2 rounded-lg">Completed</button>} icon={<AccountCreationIcon />} label='Initiate Account Creation' desc='Register a candidate account with your basic information.' />
                <InfoItem buttons={<button onClick={handleVerification} className="cta cursor-pointer p-2 rounded-lg border text-[#475367] border-[#E4E7EC]">Setup Verification Details</button>} icon={<VerificationIcon />} label='Provide Verification Information' desc='Please share additional details about your identity to help us verify who you are.' />
                <InfoItem buttons={<button className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Await Approval</span></button>} icon={<ApprovalIcon />} label='Await Admin Approval' desc='Please wait for admin approval after submitting your verification.' />
                <InfoItem buttons={[<button key='button-one' className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Go to Overview</span></button>, <button key='button-two' className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Await Exams</span></button>]} icon={<ExamsIcon />} label='Participate in League Exams' desc='Participate in exams on due date once verification is complete.' />
            </div>
        </ResponsiveContainer>
    )
}



export function InfoItem({ icon, label, desc, buttons }: Readonly<{ icon: React.ReactNode, label: string, desc: string, buttons: React.ReactNode | React.ReactNode[] }>) {
    return (
        <div className='flex justify-between items-center'>
            <div className="flex gap-2">
                <span className="icon">{icon}</span>
                <div className="flex flex-col ">
                    <p className='font-bold line-through'>{label}</p>
                    <p className={clsx('text-sm line-through')}>{desc}</p>
                </div>
            </div>
            <div className="flex justify-between gap-1">
                {Array.isArray(buttons) ? buttons.map((button: React.ReactNode, index: number) => <span key={`button-${index}`}>{button}</span>) : buttons}

            </div>
        </div>
    )
}


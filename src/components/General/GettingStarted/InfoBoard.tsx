import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { AccountCreationIcon, LockedIcon } from '@/components/ui/SvgAsset/GeneralAsset';
import React from 'react'
import { ApprovalIcon, ExamsIcon, VerificationIcon } from './GettingStartedAssets';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import useGetAccountMgt from '@/hooks/useGetAccountMgt';


export default function InfoBoard() {

    const { authState } = useAuth()

    const router = useRouter()
    const { data } = useGetAccountMgt()
    
    
    function handleVerification() {
        router.push('/get-started/verification')
    }


    function handleOverview() {
        if (authState?.userType == 'candidate') {
            router.push('/exam-portal')
        }
        else if (authState?.userType == 'staff') {
            router.push('/admin/overview')
        }
    }

    let allProvided;
    if (data) {
        allProvided = ['profile_photo', 'verification_document', 'id_card'].every(key => !!data[key]);


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
                <InfoItem isApproved buttons={<button className="cta font-bold text-[#099137]  border-[#E7F6EC] border   bg-[#E7F6EC] p-2 rounded-lg">Completed</button>} icon={<AccountCreationIcon />} label='Initiate Account Creation' desc='Register a candidate account with your basic information.' />
                <InfoItem isApproved={allProvided} buttons={allProvided ? <button className="cta font-bold text-[#099137]  border-[#E7F6EC] border   bg-[#E7F6EC] p-2 rounded-lg">Completed</button> : <button onClick={handleVerification} className="cta cursor-pointer p-2 rounded-lg border text-[#475367] border-[#E4E7EC]">Setup Verification Details</button>} icon={<VerificationIcon />} label='Provide Verification Information' desc='Please share additional details about your identity to help us verify who you are.' />
                <InfoItem isApproved={data?.is_verified ?? false} buttons={data?.is_verified ?? false ? <button className="cta font-bold text-[#099137] border-[#E7F6EC] border bg-[#E7F6EC] p-2 rounded-lg">Approved</button> : <button className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Await Approval</span></button>} icon={<ApprovalIcon />} label='Await Admin Approval' desc='Please wait for admin approval after submitting your verification.' />
                <InfoItem buttons={[<button onClick={handleOverview} disabled={!data?.is_verified} key='button-one' className={clsx("cta p-2 rounded-lg inline-flex justify-between gap-1 border items-center ", data?.is_verified ?? false ? ' cursor-pointer ' : 'text-[#475367] bg-[#E4E7EC]  border-[#E4E7EC]')}>{data?.is_verified ? null : <span><LockedIcon /></span>}<span>Go to Overview</span></button>, <button key='button-two' className="cta p-2 rounded-lg inline-flex justify-between border text-[#475367] gap-1 items-center bg-[#E4E7EC] border-[#E4E7EC]"><span><LockedIcon /></span><span>Await Exams</span></button>]} icon={<ExamsIcon />} label='Participate in Exams' desc='Participate in exams on due date once verification is complete.' />
            </div>
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


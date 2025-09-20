"use client"
import useGetBreadCrumbs from '@/hooks/useGetBreadCrumbs';
import { capitalizeWord } from '@/utils/capitalizeWords';
import Link from 'next/link';
import { GreaterThanIcon, HomeIcon } from '../General/GettingStarted/GettingStartedAssets';
import Button from '../ui/Button';
import ResponsiveContainer from '../ui/ResponsiveContainer';
import { ActiveIcon, AngleIcon, BroadcastIcon, InactiveIcon, ManageQuestionIcon, PendingIcon, RegisteredIcon, ViewLeaderBoardIcon } from './AdminIcons';

export default function OverviewSection() {
    return (
        <div className='flex flex-col gap-1 '>
            <OverviewHeader />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <OverviewSummaryCard />
                <QuickActionsCard />
            </div>
        </div>
    )
}


function QuickActionsCard() {
    return <ResponsiveContainer className='flex gap-4 p-3 flex-col mx-auto'>
        <h2 className='capitalize text-xl font-bold'>quick actions</h2>
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <span><ManageQuestionIcon/></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Manage Exam Questions</p>
                    <p className='text-xs'>Manage Exam Questions</p>
                </div>
                  <span className='ml-10'><AngleIcon/></span>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <span><ViewLeaderBoardIcon/></span>
                <div className="flex flex-col">
                    <p className='text-sm'>View Leaderboard</p>
                    <p className='text-xs'>Keep updated on student scores</p>
                </div>
                <span className='ml-10'><AngleIcon/></span>
            </div>
            <div className="flex gap-2 items-center">
                <span><BroadcastIcon/></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Send Broadcast</p>
                    <p className='text-xs'>Send important notifications to all members</p>
                </div>
                  <span className='ml-10'><AngleIcon/></span>
            </div>
        </div>
    </ResponsiveContainer>
}


function OverviewSummaryCard() {
    return <ResponsiveContainer className='flex gap-2 px-3 flex-col mx-auto'>
        <div className="flex justify-between">
            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><RegisteredIcon /></span>
                    <p>REGISTERED STUDENTS</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>0</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>


              <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><PendingIcon /></span>
                    <p>PENDING STUDENTS</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>0</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>



             <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><ActiveIcon /></span>
                    <p>ACTIVE STUDENTS</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>0</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>



            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><InactiveIcon /></span>
                    <p>INACTIVE STUDENTS</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>0</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>

           
           
        </div>
    </ResponsiveContainer>
}





function OverviewHeader() {

    const pathSegments = useGetBreadCrumbs();


    return <div className='flex bg-white px-10 py-3 justify-between items-center'>
        <div className="flex flex-col gap-0.5">
            <p className='font-normal flex gap-2 text-2xl'><span>Staff Portal</span><span>Exam System</span></p>
            <div className="flex gap-2">
                <ol className='flex'>
                    {pathSegments.map((segment, index) => {
                        const href = '/' + pathSegments.slice(0, index + 1).join('/');
                        const isLast = index == pathSegments.length - 1;
                        const decodeHref = decodeURIComponent(segment)

                        if (index == 0) {
                            return <li key={href} className='inline-flex items-center justify-between text-[#667185] gap-1 px-1'>
                                <span><HomeIcon /></span>
                                <Link href={href}>{capitalizeWord(decodeHref)}</Link>
                            </li>
                        }
                        return <li key={href} className='inline-flex justify-between px-1 items-center gap-1'>
                            <span><GreaterThanIcon /></span>
                            {isLast ? <span>{capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
                        </li>
                    })}
                </ol>
            </div>

        </div>
        <div>

            <Button className='px-2 text-sm'>CREATE EXAM SESSION</Button>
        </div>

    </div>
}
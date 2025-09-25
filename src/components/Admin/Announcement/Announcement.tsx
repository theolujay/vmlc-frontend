import React from 'react'
import AdminHeader from '../AdminHeader'
import Button from '@/components/ui/Button'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { BroadcastAnnouncementIcon, EmailChannelIcon, PlatformChannelIcon, SMSIcon } from './AnnouncementIconts'
// import { BroadcastIcon } from './AnnouncementIconts'
// import { BroadcastIcon } from '../AdminIcons'




export default function Announcement() {
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader label='Announcement' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND BROADCAST</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <AnnouncementCard />
            </div>

        </div>
    )
}


function AnnouncementCard() {
    return <ResponsiveContainer className='flex gap-1 flex-col'>
        <h2>Candidate Info</h2>
        <div className="flex justify-between">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><BroadcastAnnouncementIcon /></span>
                    <span className='text-sm'>TOTAL BROADCAST</span>

                </div>
                <span className='font-bold text-3xl'>0</span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><EmailChannelIcon /></span>
                    <span className='text-sm'>EMAIL CHANNEL</span>

                </div>
                <span className='font-bold text-3xl'>0</span>
            </div>


            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><PlatformChannelIcon /></span>
                    <span className='text-sm'>PLATFORM CHANNEL</span>

                </div>
                <span className='font-bold text-3xl'>0</span>
            </div>


            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><SMSIcon /></span>
                    <span className='text-sm'>SMS CHANNEL</span>

                </div>
                <span className='font-bold text-3xl'>0</span>
            </div>




        </div>
    </ResponsiveContainer>
}

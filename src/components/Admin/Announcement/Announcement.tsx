import React, { useState } from 'react'
import AdminHeader from '../AdminHeader'
import Button from '@/components/ui/Button'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { BroadcastAnnouncementIcon, EmailChannelIcon, PlatformChannelIcon, SMSIcon } from './AnnouncementIconts'
import Table from '@/components/ui/Table'
import { FilterIcon, SortIcon } from '../AdminIcons'
import SendBulkMessageModal from '../../Modals/SendBulkMessageModal'
// import { BroadcastIcon } from './AnnouncementIconts'
// import { BroadcastIcon } from '../AdminIcons'




export default function Announcement() {
    const [open,setOpen]=useState(false)
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader label='Announcement' actionButton={<Button onClick={()=>setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND BROADCAST</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <AnnouncementCard />
                <AnnouncementHistoryTable />
            </div>
<SendBulkMessageModal open={open} close={setOpen} />
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


export function AnnouncementHistoryTable() {
    const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Announcement History</h2>
                <p>This table shows the total announcement history sent from the platform</p>
            </div>
            <div className="flex justify-between gap-2">
                <div className="flex">
                    <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>
        <Table data={[]} columns={columns} />
    </ResponsiveContainer>
}
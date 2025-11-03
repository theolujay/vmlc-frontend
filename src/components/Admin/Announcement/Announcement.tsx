import Button from '@/components/ui/Button'
import CustomTable from '@/components/ui/CustomTable'
import TablePagination from '@/components/ui/Pagination/TablePagination'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useGetBroadcast from '@/hooks/useGetBroadcast'
import usePagination from '@/hooks/usePagination'
import { formatDate, formatTimeToString } from '@/utils/formatFileSize'
import { getUserName } from '@/utils/generalUtils'
import clsx from 'clsx'
import { Dispatch, SetStateAction, useState } from 'react'
import SendBulkMessageModal from '../../Modals/SendBulkMessageModal'
import AdminHeader from '../AdminHeader'
import { FilterIcon, SortIcon } from '../AdminIcons'
import { BroadcastAnnouncementIcon, EmailChannelIcon, PlatformChannelIcon, SMSIcon } from './AnnouncementIconts'
import { BroadcastItemType } from '@/types/BroadCastType'



export default function Announcement() {
    const [open, setOpen] = useState(false)
    const { data } = useGetBroadcast()
    const { page, setPage } = usePagination()
    const totalBroadCast = data?.results.length;


    const mediumCounts = data?.results.reduce((acc, item) => {
        item.mediums.forEach((medium) => {
            acc[medium] = (acc[medium] || 0) + 1;
        });
        return acc;
    }, { email: 0, platform: 0, sms: 0 } as Record<string, number>);

    

    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader label='Announcement' actionButton={<Button onClick={() => setOpen(true)} className="inline-flex gap-2 border px-2 items-center text-sm"><span>SEND BROADCAST</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <AnnouncementCard platformChannel={mediumCounts?.platform ?? 0} emailChannel={mediumCounts?.email ?? 0} total={totalBroadCast ?? 0} />
                <AnnouncementHistoryTable page_count={data?.total_pages ?? 0} onPageChange={setPage} currentPage={page} announcementData={data?.results ?? []} />
            </div>
            <SendBulkMessageModal open={open} close={setOpen} />
        </div>
    )
}


function AnnouncementCard({ total, emailChannel, platformChannel }: { total: number, emailChannel: number, platformChannel: number }) {
    return <ResponsiveContainer className='flex gap-1 flex-col'>
        <h2>Candidate Info</h2>
        <div className="flex justify-between">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><BroadcastAnnouncementIcon /></span>
                    <span className='text-sm'>TOTAL BROADCAST</span>

                </div>
                <span className='font-bold text-3xl'>{total}</span>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><EmailChannelIcon /></span>
                    <span className='text-sm'>EMAIL CHANNEL</span>

                </div>
                <span className='font-bold text-3xl'>{emailChannel}</span>
            </div>


            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <span><PlatformChannelIcon /></span>
                    <span className='text-sm'>PLATFORM CHANNEL</span>

                </div>
                <span className='font-bold text-3xl'>{platformChannel}</span>
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


type Props = {
    announcementData:   BroadcastItemType[],
    currentPage: number,
    page_count: number,
    onPageChange: Dispatch<SetStateAction<number>>
}

export function AnnouncementHistoryTable({ announcementData, currentPage, page_count, onPageChange }: Readonly<Props>) {

    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Announcement History</h2>
                <p>This table shows the total announcement history sent from the platform</p>
            </div>
            <div className="flex items-center justify-between gap-2">
                <div className="flex ">
                    <input type="text" placeholder='Search questions' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center h-10 gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center h-10 gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>
        <CustomTable
            data={announcementData}
            columns={[
                {
                    key: "message", header: "Message", render: (_, row) => <div className="flex  items-center gap-1">
                        <span>{row.message}</span>
                    </div>
                },
                {
                    key: 'sent', header: "Sent by", render: (_, row) => {
                        const userName = getUserName(row.created_by.user.first_name, row.created_by.user.last_name)
                        return <div className="flex  items-center gap-1">
                            <span>{userName}</span>
                        </div>
                    }
                },
                {
                    key: 'mode', header: "Modes", render: (_, row) => {
                        return <div className={clsx("flex items-center gap-1")}>
                            <div className='flex items-start gap-1'>{row?.mediums.map((val:string, index: number) => <span key={`medium-${index}`} className={clsx(getAppropriatePlatformColor(val), 'px-2 rounded-full')}>{val}</span>)}</div>
                        </div>
                    }
                },
                {
                    key: 'Date', header: "Date & Time", render: (_, row) => {
                        const getDate = formatDate(row.created_at);
                        const time = formatTimeToString(row.created_at)
                        return <div className="flex flex-col items-center gap-1">
                            <span>{getDate}</span>
                            <span className='text-sm text-[#475467]'>{time}</span>
                        </div>
                    }
                },
                {
                    key: 'action', header: "Action", render: (_, row) => (
                        <div className="flex justify-between items-center gap-1">
                            <button className="cursor-pointer font-semibold text-[#6941C6]">View Details</button>
                        </div>
                    ),
                }
            ]}
            footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />}
        />
    
    </ResponsiveContainer>
}




function getAppropriatePlatformColor(val: string) {
    switch (val) {
        case 'platform':
            return 'bg-[#EEF4FF] text-[#3538CD]';
        case 'email':
            return 'bg-[#F9F5FF] text-[#6941C6]';
        case 'sms':
            return 'bg-[#FDF2FA] text-[#C11574]';
        default:
            return 'bg-grey text-black'
    }
}


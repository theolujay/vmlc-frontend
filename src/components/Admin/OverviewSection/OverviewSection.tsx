"use client"
import CustomTable from '@/components/ui/CustomTable';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';
import useListUserMgt from '@/hooks/useListUserMgt';
import usePagination from '@/hooks/usePagination';
import { ActivityHistoryUserType } from '@/types/auth';
import { MgtItem } from '@/types/UserMgtType';
import { formatDate } from '@/utils/formatFileSize';
import { getUserName } from '@/utils/generalUtils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import Button from '../../ui/Button';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import AdminHeader from '../AdminHeader';
import { ActiveIcon, AngleIcon, BroadcastIcon, FilterIcon, InactiveIcon, ManageQuestionIcon, PendingIcon, RegisteredIcon, SortIcon, ViewLeaderBoardIcon } from '../AdminIcons';



function shouldShowHeaderButtons(role: string): boolean {
    switch (role) {
        case 'volunteer':
        case 'moderator':
            return false;

        case 'admin':
        case 'manager':
        case 'superadmin':
        case 'sponsor':
            return true;

        default:
            return false;
    }
}







export default function OverviewSection() {
    const { page, setPage } = usePagination()
    const [filters, setFilters] = useState<Record<string, string>>({
        search: '',
        profile:'candidate'
    })
    // const { data } = useGetCandidateList(page, filters)

const {data}=useListUserMgt(page,filters)
console.log(data,'overview section data')
   
    

    return (
        <div className='flex flex-col gap-1 '>
            {/* <OverviewHeader /> */}
            <AdminHeader isExport label='Overview' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm">SEND BROADCAST</Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <OverviewSummaryCard active={data?.stats_overview?.candidates?.active??0} inactive={data?.stats_overview?.candidates?.inactive??0} pending={data?.stats_overview.candidates?.pending_verification??0} registeredStudents={data?.stats_overview.candidates?.registered??0} />
                <QuickActionsCard />
                <ActivityHistoryCard handleSearch={setFilters} page_count={data?.pagination.total_pages ?? 0} currentPage={page} onPageChange={setPage} data={data?.results as MgtItem[] ?? []} />
            </div>
        </div>
    )
}





function ActivityHistoryCard({ data, onPageChange, currentPage, page_count, handleSearch }: Readonly<{
     data: ActivityHistoryUserType[], 
    // data: MgtItem[],
    handleSearch: Dispatch<SetStateAction<{}>>, onPageChange: Dispatch<SetStateAction<number>>, currentPage: number, page_count: number }>) {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const { searchInput, setSearchInput } = useDebouncedSearch(handleSearch);


    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Activity History</h2>
                <p>This table shows the total activity history on the platform</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div className="flex">
                    <input value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type="text" placeholder='Search by student, staff name or ID' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border h-10 rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center gap-2 border h-10 rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>
        <CustomTable data={data} columns={[
            {
                key: 'S/N', header: 'S/N',
                render: (_, __, index) => <div className='text-center py-2 max-w-[6vw] overflow-clip'>{index + 1}</div>

            },
            {
                key: 'Name', header: 'Name', render: (_, row) => {
                    const userName = getUserName(row.user.first_name, row.user.last_name)
                    return <div className='flex items-center gap-1'>{userName}</div>
                }
            },
            {
                key: 'User Role',
                header: 'User Role',
                render: (_, row) => <div className='flex items-center gap-1'>{row.role}</div>
            },
            { key: 'Email Address', header: 'Email Address', render: (_, row) => <div className='flex items-center gap-1'>{row.user.email}</div> },
            { key: 'Application Date', header: 'Application Date', render: (_, row) => <div className='flex items-center gap-1'>{formatDate(row.user.date_joined)}</div> },
            { key: 'Status', header: 'Status', render: (_, row) => <div className='flex items-center capitalize gap-1'>{row.status}</div> },
            {
                key: 'Action', header: 'Action', render: (_, row) => {
                    const href = (() => {
                        const query = new URLSearchParams(searchParams.toString());
                        query.set("view", "view-details");
                        query.set("id", row.user.id);
                        return `${pathName}?${query.toString()}`;
                    })();
                    return <Link
                        href={href}
                        className='text-[#3E4095] font-semibold '>View details</Link>
                }
            }]}
            footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />} />
    </ResponsiveContainer>
}

function QuickActionsCard() {
    return <ResponsiveContainer className='flex overflow-x-auto w-full gap-4 p-3 flex-col mx-auto'>
        <h2 className='capitalize text-xl font-bold'>quick actions</h2>
        <div className="flex justify-between">
            <Link href='/admin/overview?tab=Exam+System&page=1' className="flex gap-2 items-center">
                <span><ManageQuestionIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Manage Exam Questions</p>
                    <p className='text-xs'>Manage Exam Questions</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </Link>
            <Link href='/admin/overview?tab=Leaderboards' className="flex gap-2 items-center justify-between">
                <span><ViewLeaderBoardIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>View Leaderboard</p>
                    <p className='text-xs'>Keep updated on student scores</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </Link>
            <Link href='/admin/overview?tab=Announcement' className="flex gap-2 items-center">
                <span><BroadcastIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Send Broadcast</p>
                    <p className='text-xs'>Send important notifications to all members</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </Link>
        </div>
    </ResponsiveContainer>
}


function OverviewSummaryCard({ registeredStudents,pending,active,inactive }: { registeredStudents: number,pending:number,active:number,inactive:number }) {
    return <ResponsiveContainer className='flex gap-2 px-3 flex-col mx-auto'>
        <div className="flex justify-between">
            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><RegisteredIcon /></span>
                    <p>REGISTERED CANDIDATES</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>{registeredStudents}</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>


            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><PendingIcon /></span>
                    <p>PENDING CANDIDATES</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>{pending}</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>



            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><ActiveIcon /></span>
                    <p>ACTIVE CANDIDATES</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>{active}</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>



            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><InactiveIcon /></span>
                    <p>INACTIVE CANDIDATES</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>{inactive}</span>
                    <div className="flex"><span className='text-xs text-[#0F973D]'>0%</span></div>
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}





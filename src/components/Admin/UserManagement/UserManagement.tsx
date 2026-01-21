"use client"
import { AddIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import Button from '@/components/ui/Button'
import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useListUserMgt from '@/hooks/useListUserMgt'
import { MgtItem, MgtItemType, OverviewType, StatOverviewType } from '@/types/UserMgtType'
import { formatDate } from '@/utils/formatFileSize'
import { getUserName } from '@/utils/generalUtils'
import { getUserInitials } from '@/utils/capitalizeWords'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'
import Image from 'next/image'
import AdminHeader from '../AdminHeader'
import { FilterIcon, SortIcon } from '../AdminIcons'
import { DoughnutChart } from '../Charts/ProgressRing'
import ProfileModal from '@/components/Modals/ProfileModal'
import { useState } from 'react'

export default function UserManagement() {
    const pathName = usePathname();
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const { data } = useListUserMgt()
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    
    // const { data: testData } = useGetStatOverview()

    const overview = data?.stats_overview;

    function addStaffMember() {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', 'add-staff')
        const route = `${pathName}?${params.toString()}`
        router.push(route)
    }

    const handleViewProfile = (id: string) => {
        setSelectedUserId(id);
        setProfileOpen(true);
    };

    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button onClick={addStaffMember} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD STAFF</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <UserSummaryCard overview={overview} />
                <UserHistoryTable candidates={data?.results as (MgtItem | MgtItemType)[]?? []} onViewProfile={handleViewProfile} />
            </div>

            {selectedUserId && (
                <ProfileModal 
                    id={selectedUserId} 
                    open={profileOpen} 
                    close={setProfileOpen} 
                    isOwnProfile={false}
                />
            )}
        </div>
    )
}



function UserSummaryCard({ overview }: { overview?: StatOverviewType }) {
    if (!overview) return null;

    return <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <UserCard stat={overview?.staff} header='TOTAL STAFFS' />
        <UserCard stat={overview?.candidates} header='TOTAL STUDENTS' />
    </ResponsiveContainer>
}












// const chartData = [
//     { value: 30, color: "#0088cc" }, // blue
//     { value: 12, color: "#f4a300" }, // orange
//     { value: 4, color: "#e04c4c" },  // red
// ];











function UserCard({ header, stat }: Readonly<{ header: ReactNode, stat: OverviewType }>) {
    // if (!stat) {
        
    //     return <Spinner />
    // }
    const chartData = [
        { value: stat.active, color: "#0088cc" }, // blue
        { value: stat.pre_registered, color: "#f4a300" }, // orange
        { value: stat.inactive, color: "#e04c4c" },  // red
        // {value:stat.deactivated,color:'#d4107'}

        {value:stat.deactivated,color:'#000'}
        
    ];


    


    return <div className='flex flex-col gap-2 rounded-2xl border-[#E4E7EC] border'>
        <div className="flex header p-2 font-bold bg-[#F7F9FC]  rounded-tr-2xl rounded-tl-2xl">
            {header}
        </div>
        <div className="flex px-3 gap-3 pb-2 justify-between items-center">
            {/* <DoughnutChart /> */}
            <div className="flex">
                <DoughnutChart data={chartData} total={stat.registered} />
                {/* <ProgressRing/> */}
            </div>
            <div className="flex-1 gap-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#01ACEA] h-3"></span>
                        <span>Active</span>

                    </div>
                    <span>{stat.active}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#F3A218] h-3"></span>
                        <span>Pending</span>

                    </div>
                    <span>{stat.pre_registered}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#DD524D] h-3"></span>
                        <span>Inactive</span>

                    </div>
                    <span>{stat.inactive}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#000] h-3"></span>
                        <span>Deactivated</span>

                    </div>
                    <span>{stat.deactivated}</span>
                </div>
            </div>
        </div>
    </div>
}






function UserHistoryTable({ candidates, onViewProfile }: { candidates: (MgtItem | MgtItemType)[], onViewProfile: (id: string) => void }) {


    // const pathName = usePathname();
    // const searchParams = useSearchParams();

//  const { page, setPage } = usePagination()
console.log(candidates,'candidates in user history table')
    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Users</h2>
                <p>List of candidate and staff users on the portal</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>

        <CustomTable
            columns={[
                {
                    key: 'Name',
                    header: 'Name',
                    render: (_, row) => {
                        const user = 'user' in row && row.user ? row.user : (row as MgtItemType);
                        const userName = getUserName(user.first_name || '', user.last_name || '');
                        const userInitials = getUserInitials(userName);
                        const profilePicture = 'user' in row && row.user ? row.user.profile_picture : (row as MgtItemType).profile_picture;

                        return (
                            <div className="flex items-center gap-2">
                                <div className="w-[35px] h-[35px] rounded-full relative overflow-hidden bg-[#CCEEFB] flex items-center justify-center shrink-0">
                                    {profilePicture ? (
                                        <Image 
                                            src={profilePicture} 
                                            alt={userName} 
                                            fill 
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="font-semibold text-xs">{userInitials}</span>
                                    )}
                                </div>
                                <span>{userName}</span>
                            </div>
                        );
                },},
                {
                    key: 'email',
                    header: 'Email Address',
                    render: (_, row) => {
                        const email = 'user' in row && row.user ? row.user.email : (row as MgtItemType).email;
                        return <div className="flex items-center gap-1">{email}</div>
                    }
                },
                {
                    key: 'role',
                    header: 'Role',
                    render: (_, row) => <div className="flex capitalize items-center gap-1">{'role' in row ? row.role : 'N/A'}</div>
                },
                {
                    key: 'profile_type',
                    header: 'Profile',
                    render: (_, row) => <div className="flex  capitalize items-center gap-1">{'profile_type' in row ? row.profile_type : 'N/A'}</div>
                },
                {
                    key: 'application',
                    header: 'Joined',
                    render: (_, row) => {
                        const dateJoined = 'user' in row && row.user ? row.user.date_joined : (row as MgtItemType).date_joined;
                        return <div className="flex  items-center gap-1">{dateJoined ? formatDate(dateJoined) : 'N/A'}</div>
                    }
                },
                {
                    key: 'status',
                    header: 'Status',
                    render: (_, row) => <div className="flex capitalize items-center gap-1">{'status' in row ? row.status : 'N/A'}</div>
                },
                {
                    key: 'Action',
                    header: 'Detail',
                    align: 'right',
                    render: (_, row) => {
                        const id = 'user' in row && row.user ? row.user.id : (row as MgtItemType).id;
                        return (
                            <button 
                                onClick={() => onViewProfile(id)}
                                className="text-[#3E4095] font-bold hover:underline px-3 text-sm cursor-pointer"
                            >
                                View
                            </button>
                        );
                    },
                },
            ]}
            data={candidates}
        />
    
    </ResponsiveContainer>
}
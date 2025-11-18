"use client"
import { AddIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import Button from '@/components/ui/Button'
import CustomTable from '@/components/ui/CustomTable'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useGetStatOverview from '@/hooks/useGetStatOverview'
import useListUserMgt from '@/hooks/useListUserMgt'
import { MgtItem, MgtTypeItem, OverviewType, StatOverviewType } from '@/types/UserMgtType'
import { formatDate } from '@/utils/formatFileSize'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'
import AdminHeader from '../AdminHeader'
import { FilterIcon, SortIcon } from '../AdminIcons'
import { DoughnutChart } from '../Charts/ProgressRing'
import { getUserName } from '@/utils/generalUtils'
import Spinner from '@/components/ui/spinner/spinner'
import Link from 'next/link'

export default function UserManagement() {
    const { data } = useListUserMgt()
    const pathName = usePathname();
    const searchParams = useSearchParams()
    const router = useRouter()


    console.log(data,'what is data list here')

    const { data: testData } = useGetStatOverview()
console.log(testData,'what is in test data')


const overview=data?.stats_overview;

    function addStaffMember() {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', 'add-staff')
        const route = `${pathName}?${params.toString()}`
        router.push(route)
    }



    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button onClick={addStaffMember} className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD STAFF</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <UserSummaryCard overview={overview} />
                <UserHistoryTable candidates={data?.results ?? []} />
            </div>

        </div>
    )
}



function UserSummaryCard({overview}:{overview?:StatOverviewType}) {
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










function UserCard({ header,stat }: Readonly<{ header: ReactNode,stat:OverviewType }>) {
    if (!stat) {
        return <Spinner/>
    }
const chartData = [
    { value: stat.active, color: "#0088cc" }, // blue
    { value: stat.pending_verification, color: "#f4a300" }, // orange
    { value: stat.inactive, color: "#e04c4c" },  // red
    // {value:stat.inactive,color:''}
];



    console.log(stat,'stat from user card')
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
                    <span>{stat.pending_verification}</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#DD524D] h-3"></span>
                        <span>Inactive</span>

                    </div>
                    <span>{stat.inactive}</span>
                </div>
            </div>
        </div>
    </div>
}






function UserHistoryTable({ candidates }: { candidates: MgtItem[] }) {
    

    const pathName = usePathname();
    const searchParams = useSearchParams();
    

//     const href = (() => {
//   const query = new URLSearchParams(searchParams.toString());
//   query.set("view", "view-user");
//   query.set("id", id);
//   return `${pathName}?${query.toString()}`;
// })();



    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Users History</h2>
                <p>This table shows the users history on the platform.</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div className="flex ">
                    <input type="text" placeholder='Search questions' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center gap-2 border rounded-md h-10 px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>

        <CustomTable
            columns={[
                {
                    key: 'Name',
                    header: 'Name',
                    render: (_,row) => <div className="flex  items-center gap-1">{getUserName(row.first_name,row.last_name)}</div>
                },
                // {
                //     key: 'role',
                //     header: 'Role',
                //     render: (_, row) => <div className="flex  items-center gap-1">{row.last_name}</div>
                // },
                {
                    key: 'email',
                    header: 'Email Address',
                    render: (_, row) => <div className="flex  items-center gap-1">{row.email}</div>
                },
                {
                    key: 'application',
                    header: 'Application Date',
                    render: (_, row) => <div className="flex  items-center gap-1">{formatDate(row.date_joined)}</div>
                },
                {
                    key: 'status',
                    header: 'Status',
                    render: (_, row) => <div className="flex capitalize items-center gap-1">{row.is_email_verified?'Approved':'Pending'}</div>
                },
                {
                    key: 'action',
                    header: "Action",
                    render: (_,row) => {
                         const href = (() => {
  const query = new URLSearchParams(searchParams.toString());
  query.set("view", "view-user");
  query.set("id", row.id);
  return `${pathName}?${query.toString()}`;
})();
                        return (
                        <div className="flex justify-between items-center gap-1">
                            <Link href={href} className="cursor-pointer font-semibold text-[#3E4095]">View Details</Link>
                        </div>
                    )},
                }
            ]}
            data={candidates}
        // footer={<TablePagination />}
        />
    </ResponsiveContainer>
}
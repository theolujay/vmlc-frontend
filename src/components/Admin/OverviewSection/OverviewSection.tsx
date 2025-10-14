"use client"
import { useAuth } from '@/contexts/AuthProvider';
import Button from '../../ui/Button';
import ResponsiveContainer from '../../ui/ResponsiveContainer';
import Table from '../../ui/Table';
import AdminHeader from '../AdminHeader';
import { ActiveIcon, AngleIcon, BroadcastIcon, FilterIcon, InactiveIcon, ManageQuestionIcon, PendingIcon, RegisteredIcon, SortIcon, ViewLeaderBoardIcon } from '../AdminIcons';
import { useGetCandidateList } from '@/hooks/useCandidateMgt';
import TablePagination from '@/components/ui/Pagination/TablePagination';
import { ActivityHistoryUserType } from '@/types/auth';
import { Dispatch, SetStateAction, useState } from 'react';
import { da } from 'zod/v4/locales';



function shouldShowHeaderButtons(role:string):boolean{
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
    // const {authState}=useAuth()
    const [page,setPage]=useState(1)
    const {data}=useGetCandidateList(page)
    console.log(data,'what do we have here for overview section')
    return (
        <div className='flex flex-col gap-1 '>
            {/* <OverviewHeader /> */}
            <AdminHeader isExport  label='Overview' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm">SEND BROADCAST</Button> } />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <OverviewSummaryCard registeredStudents={data?.count??0} />
                <QuickActionsCard />
                <ActivityHistoryCard page_count={data?.total_pages} currentPage={page} onPageChange={setPage} data={data?.results??[]} />
            </div>
        </div>
    )
}


function ActivityHistoryCard({data, onPageChange,currentPage,page_count}:Readonly<{data:ActivityHistoryUserType[],onPageChange:Dispatch<SetStateAction<number>>,currentPage:number,page_count:number}>){
   

  
    return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
        <div className="flex justify-between px-3">
            <div className="flex gap-1 flex-col">
                <h2 className='font-bold'>Activity History</h2>
                <p>This table shows the total activity history on the platform</p>
            </div>
            <div className="flex justify-between items-center gap-2">
                <div className="flex">
                    <input type="text" placeholder='Search by student, staff name or ID' className='border h-10 px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
                </div>
                <button className='inline-flex items-center gap-2 border h-10 rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon/></span><span className='text-[#344054]'>Sort</span></button>
                <button className='inline-flex items-center gap-2 border h-10 rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon/></span><span className='text-[#344054]'>Filter</span></button>
            </div>
        </div>
        <Table footer={<TablePagination currentPage={currentPage} pageCount={page_count} onPageChange={onPageChange} />} label='No activity has been made yet' desc={<>All application made on the platform would appear here </>} data={data} columns={['Submission ID','Name','User Role','Email Address','Application Date','Status','Action']} />
    </ResponsiveContainer>
}

function QuickActionsCard() {
    return <ResponsiveContainer className='flex overflow-x-auto w-full gap-4 p-3 flex-col mx-auto'>
        <h2 className='capitalize text-xl font-bold'>quick actions</h2>
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <span><ManageQuestionIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Manage Exam Questions</p>
                    <p className='text-xs'>Manage Exam Questions</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </div>
            <div className="flex gap-2 items-center justify-between">
                <span><ViewLeaderBoardIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>View Leaderboard</p>
                    <p className='text-xs'>Keep updated on student scores</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </div>
            <div className="flex gap-2 items-center">
                <span><BroadcastIcon /></span>
                <div className="flex flex-col">
                    <p className='text-sm'>Send Broadcast</p>
                    <p className='text-xs'>Send important notifications to all members</p>
                </div>
                <span className='ml-10'><AngleIcon /></span>
            </div>
        </div>
    </ResponsiveContainer>
}


function OverviewSummaryCard({registeredStudents}:{registeredStudents:number}) {
    return <ResponsiveContainer className='flex gap-2 px-3 flex-col mx-auto'>
        <div className="flex justify-between">
            <div className="flex gap-4 flex-col">
                <div className="flex gap-2">
                    <span><RegisteredIcon /></span>
                    <p>REGISTERED STUDENTS</p>
                </div>
                <div className='flex gap-3 items-center'><span className='font-bold text-2xl'>{registeredStudents}</span>
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





// function OverviewHeader() {

//     const pathSegments = useGetBreadCrumbs();


//     return <div className='flex bg-white px-10 py-3 justify-between items-center'>
//         <div className="flex flex-col gap-0.5">
//             <p className='font-normal flex gap-2 text-2xl'><span>Staff Portal</span><span>Exam System</span></p>
//             <div className="flex gap-2">
//                 <ol className='flex'>
//                     {pathSegments.map((segment, index) => {
//                         const href = '/' + pathSegments.slice(0, index + 1).join('/');
//                         const isLast = index == pathSegments.length - 1;
//                         const decodeHref = decodeURIComponent(segment)

//                         if (index == 0) {
//                             return <li key={href} className='inline-flex items-center justify-between text-[#667185] gap-1 px-1'>
//                                 <span><HomeIcon /></span>
//                                 <Link href={href}>{capitalizeWord(decodeHref)}</Link>
//                             </li>
//                         }
//                         return <li key={href} className='inline-flex justify-between px-1 items-center gap-1'>
//                             <span><GreaterThanIcon /></span>
//                             {isLast ? <span>{capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
//                         </li>
//                     })}
//                 </ol>
//             </div>

//         </div>
//         <div>

//             <Button className='px-2 text-sm'>CREATE EXAM SESSION</Button>
//         </div>

//     </div>
// }
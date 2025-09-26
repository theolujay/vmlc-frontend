import { AddIcon } from '@/components/General/GettingStarted/GettingStartedAssets'
import Button from '@/components/ui/Button'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Table from '@/components/ui/Table'
import { ReactNode } from 'react'
import AdminHeader from '../AdminHeader'
import { FilterIcon, SortIcon } from '../AdminIcons'
import { ProgressRing } from '../Charts/ProgressRing'

export default function UserManagement() {
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span><AddIcon /></span><span>ADD STAFF</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">

                <UserSummaryCard />
                <ActivityHistoryTable/>
            </div>

        </div>
    )
}



function UserSummaryCard() {
    return <ResponsiveContainer className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <UserCard header='Total Staff' />
        <UserCard header='Total Staff' />
    </ResponsiveContainer>
}

function UserCard({ header }:Readonly< { header: ReactNode }>) {
    return <div className='flex flex-col gap-2 rounded-2xl border-[#E4E7EC] border'>
        <div className="flex header p-2 bg-[#F7F9FC]  rounded-tr-2xl rounded-tl-2xl">
            {header}
        </div>
        <div className="flex px-3 justify-between items-center">
            {/* <DoughnutChart /> */}
            <div className="flex">

            <ProgressRing/>
            </div>
            <div className="flex-1 gap-1">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#01ACEA] h-3"></span>
                        <span>Active</span>

                    </div>
                    <span>0</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#01ACEA] h-3"></span>
                        <span>Not Assigned</span>

                    </div>
                    <span>0</span>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                        <span className="w-3 rounded-full bg-[#01ACEA] h-3"></span>
                        <span>Deactivated</span>

                    </div>
                    <span>0</span>
                </div>
            </div>
        </div>
    </div>
}






function ActivityHistoryTable() {
  const columns = ['S/N', 'Question', 'Difficulty', 'Date Added', 'Action']
  return <ResponsiveContainer className='flex gap-4 py-3 px-0 flex-col mx-auto'>
    <div className="flex justify-between px-3">
      <div className="flex gap-1 flex-col">
        <h2 className='font-bold'>Activity History</h2>
        <p>This table shows the total activity history on the platform</p>
      </div>
      <div className="flex justify-between gap-2">
        <div className="flex">
          <input type="text" placeholder='Search questions' className='border px-2 py-1 rounded-md border-[#E4E7EC] outline-none' />
        </div>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer '   ><span><SortIcon /></span><span className='text-[#344054]'>Sort</span></button>
        <button className='inline-flex items-center gap-2 border rounded-md px-2 py-1 border-[#E4E7EC] cursor-pointer ' ><span><FilterIcon /></span><span className='text-[#344054]'>Filter</span></button>
      </div>
    </div>
    <Table label='No activity has been made yet' desc={<>All application made on the platform would appear here </>} data={[]} columns={columns} />
  </ResponsiveContainer>
}
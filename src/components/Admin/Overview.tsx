import { Tab } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { AnnouncementIcon, ExamSystemIcon, LeaderboardIcon, OverviewIcon, UserManagementIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import OverviewSection from './OverviewSection'
const tabs:Tab[]=[
    {
        value:'Overview',
        label:<OverViewLabel/>,
        content:<OverviewSection/>
    },
     {
        value:'Exam System',
        label:<ExamSystemLabel/>,
        content:<OverviewSection/>
    },
     {
        value:'Leaderboards',
        label:<LeaderboardsLabel/>,
        content:<OverviewSection/>
    },
     {
        value:'User Management',
        label:<UserManagementLabel/>,
        content:<OverviewSection/>
    },
     {
        value:'Announcement',
        label:<AnnouncementLabel/>,
        content:<OverviewSection/>
    }
]



export default function Overview() {
  return (
    <AdminLayout>
        <TabWrapper tabListClassName='flex overflow-y-auto  gap-2 bg-white px-6' tabs={tabs} />
    </AdminLayout>
  )
}


function OverViewLabel(){
    return <div className='flex gap-1 items-center'><span><OverviewIcon/></span><span>Overview</span></div>
}


function ExamSystemLabel(){
    return <div className='flex gap-1 items-center'><span><ExamSystemIcon/></span><span>Exam System</span></div>
}


function LeaderboardsLabel(){
    return <div className='flex gap-1 items-center'><span><LeaderboardIcon/></span><span>Leaderboards</span></div>
}



function UserManagementLabel(){
    return <div className='flex gap-1 items-center'><span><UserManagementIcon/></span><span>User Management</span></div>
}


function AnnouncementLabel(){
    return <div className='flex gap-1 items-center'><span><AnnouncementIcon/></span><span>Announcement</span></div>
}

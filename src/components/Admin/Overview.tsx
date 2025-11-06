"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import {  TabType } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { AnnouncementIcon, ExamSystemIcon, LeaderboardIcon, OverviewIcon, UserManagementIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import Announcement from './Announcement/Announcement'
import ExamSectionWrapper from './ExamSystem/ExamSectionWrapper'
import LeaderBoardSection from './Leaderboard/LeaderBoardSection'
import OverviewSectionWrapper from './OverviewSection/OverviewSectionWrapper'
import StaffMgtWrapper from './UserManagement/StaffMgtWrapper'




function getTabsForRole(role: string): TabType[] {
    switch (role) {
        case 'volunteer':
        case 'moderator':
            return tabs.slice(0, 3);

        case 'admin':
        case 'manager':
        case 'superadmin':
            return tabs;

        default:
            return [];
    }
}
const tabs: TabType[] = [
    {
        value: 'Overview',
        label: <OverViewLabel />,
        content: <OverviewSectionWrapper />
        // content:<OverviewSection/>
    },
    {
        value: 'Exam System',
        label: <ExamSystemLabel />,
        content: <ExamSectionWrapper />

    },
    {
        value: 'Leaderboards',
        label: <LeaderboardsLabel />,
        content: <LeaderBoardSection />
    },
    {
        value: 'User Management',
        label: <UserManagementLabel />,
        content: <StaffMgtWrapper />
        // content:<UserManagement/>
    },
    {
        value: 'Announcement',
        label: <AnnouncementLabel />,
        content: <Announcement />
    }
]



export function OverviewTabs() {
    const { authState } = useAuth()
    const userTabs = getTabsForRole(authState?.user?.role!)

    return (
        <AdminLayout>
            <TabWrapper tabListClassName='flex overflow-y-auto border-b  border-gray-300 gap-2 bg-white px-6' tabs={userTabs} />
        </AdminLayout>
    )
}

export default withAuthentication(OverviewTabs)


function OverViewLabel() {
    return <div className='flex gap-1 items-center'><span><OverviewIcon /></span><span>Overview</span></div>
}


function ExamSystemLabel() {
    return <div className='flex gap-1 items-center'><span><ExamSystemIcon /></span><span>Exam System</span></div>
}


function LeaderboardsLabel() {
    return <div className='flex gap-1 items-center'><span><LeaderboardIcon /></span><span>Leaderboards</span></div>
}



function UserManagementLabel() {
    return <div className='flex gap-1 items-center'><span><UserManagementIcon /></span><span>User Management</span></div>
}


function AnnouncementLabel() {
    return <div className='flex gap-1 items-center'><span><AnnouncementIcon /></span><span>Announcement</span></div>
}

"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import {  TabType } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { AnnouncementIcon, ExamSystemIcon, LeaderboardIcon, OverviewIcon, SupportIcon, UserManagementIcon, ActivitiesIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import Announcement from './Announcement/Announcement'
import ExamSectionWrapper from './ExamSystem/ExamSectionWrapper'
import OverviewSectionWrapper from './OverviewSection/OverviewSectionWrapper'
import StaffMgtWrapper from './UserManagement/StaffMgtWrapper'
import LeaderBoardWrapper from './Leaderboard/LeaderBoardWrapper'
import SupportSectionWrapper from './Support/SupportSectionWrapper'
import CompetitionDashboard from './Competition/CompetitionDashboard'




function getTabsForRole(role: string): TabType[] {
    switch (role) {
        case 'volunteer':
            return tabs.slice(0, 4); // Included Competition

        case 'moderator':
            return [...tabs.slice(0, 4), tabs[6]];

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
        value: 'Competition',
        label: <CompetitionLabel />,
        content: <CompetitionDashboard />
    },
    {
        value: 'Exam System',
        label: <ExamSystemLabel />,
        content: <ExamSectionWrapper />

    },
    {
        value: 'Leaderboards',
        label: <LeaderboardsLabel />,
        // content: <LeaderBoardSection />
        content:<LeaderBoardWrapper/>
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
    },
    {
        value: 'Support',
        label: <SupportLabel />,
        content: <SupportSectionWrapper />
    }
]



import { useEffect, useState } from 'react'

export function OverviewTabs() {
    const { authState } = useAuth()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const userTabs = getTabsForRole(authState?.user?.role ?? '')

    return (
        <AdminLayout>
            {mounted && <TabWrapper tabListClassName='flex overflow-y-auto border-b  border-gray-300 gap-2 bg-white px-6' tabs={userTabs} />}
        </AdminLayout>
    )
}

export default withAuthentication(OverviewTabs)


function OverViewLabel() {
    return <div className='flex gap-1 items-center'><span><OverviewIcon /></span><span>Overview</span></div>
}

function CompetitionLabel() {
    return <div className='flex gap-1 items-center'><span><ActivitiesIcon /></span><span>Competition</span></div>
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

function SupportLabel() {
    return <div className='flex gap-1 items-center'><span><SupportIcon /></span><span>Support</span></div>
}
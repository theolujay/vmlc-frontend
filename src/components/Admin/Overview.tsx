"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import {  TabType } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { AnnouncementIcon, ExamSystemIcon, OverviewIcon, SupportIcon, UserManagementIcon, CompetitionIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import Announcement from './Announcement/Announcement'
import ExamSectionWrapper from './ExamSystem/ExamSectionWrapper'
import OverviewSectionWrapper from './OverviewSection/OverviewSectionWrapper'
import StaffMgtWrapper from './UserManagement/StaffMgtWrapper'
import SupportSectionWrapper from './Support/SupportSectionWrapper'
import CompetitionWrapper from './Competition/CompetitionWrapper'




function getTabsForRole(role: string): TabType[] {
    switch (role) {
        case 'volunteer':
            return tabs.slice(0, 3); // Overview, Competition, Exam System

        case 'moderator':
            return [...tabs.slice(0, 3), tabs[5]]; // Overview, Competition, Exam System, Support

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
        value: 'Registration',
        label: <RegistrationLabel />,
        content: <OverviewSectionWrapper />
    },
    {
        value: 'Competition',
        label: <CompetitionLabel />,
        content: <CompetitionWrapper />
    },
    {
        value: 'Exam Console',
        label: <ExamConsoleLabel />,
        content: <ExamSectionWrapper />

    },
    {
        value: 'User Mgt.',
        label: <UserMgtLabel />,
        content: <StaffMgtWrapper />
    },
    {
        value: 'Announcements',
        label: <AnnouncementsLabel />,
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


function RegistrationLabel() {
    return <div className='flex gap-1 items-center'><span><OverviewIcon /></span><span>Registration</span></div>
}

function CompetitionLabel() {
    return <div className='flex gap-1 items-center'><span><CompetitionIcon /></span><span>Competition</span></div>
}

function ExamConsoleLabel() {
    return <div className='flex gap-1 items-center'><span><ExamSystemIcon /></span><span>Exam Console</span></div>
}

function UserMgtLabel() {
    return <div className='flex gap-1 items-center'><span><UserManagementIcon /></span><span>User Mgt.</span></div>
}


function AnnouncementsLabel() {
    return <div className='flex gap-1 items-center'><span><AnnouncementIcon /></span><span>Announcements</span></div>
}

function SupportLabel() {
    return <div className='flex gap-1 items-center'><span><SupportIcon /></span><span>Support</span></div>
}

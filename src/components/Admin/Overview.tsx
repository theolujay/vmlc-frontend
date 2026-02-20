"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import {  TabType } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { BroadcastIcon, ExamSystemIcon, OverviewIcon, SupportIcon, UserManagementIcon, CompetitionIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import Broadcast from './Broadcast/Broadcast'
import ExamSectionWrapper from './ExamSystem/ExamSectionWrapper'
import OverviewSectionWrapper from './OverviewSection/OverviewSectionWrapper'
import StaffMgtWrapper from './UserManagement/StaffMgtWrapper'
import SupportSectionWrapper from './Support/SupportSectionWrapper'
import CompetitionWrapper from './Competition/CompetitionWrapper'




function getTabsForRole(role: string): TabType[] {
    switch (role) {
        case 'volunteer':
	case 'sponsor':
            return [tabs[1], tabs[0]]; // Competition, Registration

        case 'moderator':
        case 'admin':
            return [tabs[0], tabs[1], tabs[2], tabs[3]]; // Registration, Competition, Helpdesk, Exams & Questions

        case 'manager':
        case 'superadmin':
            return tabs;

        default:
            return [];
    }
}
const tabs: TabType[] = [
    {
        value: 'registration',
        label: <RegistrationLabel />,
        content: <OverviewSectionWrapper />
    },
    {
        value: 'competition',
        label: <CompetitionLabel />,
        content: <CompetitionWrapper />
    },
    {
        value: 'support',
        label: <HelpdeskLabel />,
        content: <SupportSectionWrapper />
    },
    {
        value: 'exams-questions',
        label: <ExamConsoleLabel />,
        content: <ExamSectionWrapper />

    },
    {
        value: 'broadcasts',
        label: <BroadcastsLabel />,
        content: <Broadcast />
    },
    {
        value: 'user-mgt',
        label: <UserMgtLabel />,
        content: <StaffMgtWrapper />
    },
]



import { useEffect, useState } from 'react'
import useGetRegistrationStatus from '@/hooks/useGetRegistrationStatus'
import useGetStatOverview from '@/hooks/useGetStatOverview'

export function OverviewTabs() {
    const { authState } = useAuth()
    const { data: registrationStatus } = useGetRegistrationStatus();
    const { data: statOverview } = useGetStatOverview();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    let userTabs = getTabsForRole(authState?.user?.role ?? '')

    const hasOngoingExams = (statOverview?.exams?.ongoing ?? 0) > 0;
    const isRegistrationOpen = registrationStatus?.candidate_registration?.is_open === true;

    if (hasOngoingExams) {
        // Helpdesk first if exam ongoing, Registration last
        const helpdeskTab = userTabs.find(tab => tab.value === 'support');
        const registrationTab = userTabs.find(tab => tab.value === 'registration');
        const others = userTabs.filter(tab => tab.value !== 'support' && tab.value !== 'registration');

        userTabs = [];
        if (helpdeskTab) userTabs.push(helpdeskTab);
        userTabs.push(...others);
        if (registrationTab) userTabs.push(registrationTab);
    } else if (!isRegistrationOpen) {
        // Competition first if registration closed, Registration last
        const competitionTab = userTabs.find(tab => tab.value === 'competition');
        const registrationTab = userTabs.find(tab => tab.value === 'registration');
        const others = userTabs.filter(tab => tab.value !== 'competition' && tab.value !== 'registration');

        userTabs = [];
        if (competitionTab) userTabs.push(competitionTab);
        userTabs.push(...others);
        if (registrationTab) userTabs.push(registrationTab);
    }

    return (
        <AdminLayout>
            {mounted && <TabWrapper tabListClassName='flex overflow-y-auto border-b border-gray-300 gap-2 bg-white px-6 font-sans' tabs={userTabs} />}
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
    return <div className='flex gap-1 items-center'><span><ExamSystemIcon /></span><span>Exams & Questions</span></div>
}

function UserMgtLabel() {
    return <div className='flex gap-1 items-center'><span><UserManagementIcon /></span><span>User Mgt.</span></div>
}


function BroadcastsLabel() {
    return <div className='flex gap-1 items-center'><span><BroadcastIcon /></span><span>Broadcasts</span></div>
}

function HelpdeskLabel() {
    return <div className='flex gap-1 items-center'><span><SupportIcon /></span><span>Helpdesk</span></div>
}

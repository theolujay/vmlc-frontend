"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import {  TabType } from '@/types/TabType'
import TabWrapper from '../ui/Tabs/TabWrapper'
import { BroadcastIcon, ExamSystemIcon, OverviewIcon, HelpdeskIcon, UserManagementIcon, CompetitionIcon } from './AdminIcons'
import AdminLayout from './AdminLayout'
import Broadcast from './Broadcast/Broadcast'
import ExamSectionWrapper from './ExamSystem/ExamSectionWrapper'
import OverviewSectionWrapper from './OverviewSection/OverviewSectionWrapper'
import StaffMgtWrapper from './UserManagement/StaffMgtWrapper'
import HelpdeskSectionWrapper from './Helpdesk/HelpdeskSectionWrapper'
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
        value: 'helpdesk',
        label: <HelpdeskLabel />,
        content: <HelpdeskSectionWrapper />
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



import { useEffect, useState, useMemo } from 'react'
import useGetRegistrationStatus from '@/hooks/useGetRegistrationStatus'
import useGetStatOverview from '@/hooks/useGetStatOverview'
import useListHelpdeskThreads from '@/hooks/useListHelpdeskThreads'

export function OverviewTabs() {
    const { authState } = useAuth()
    const userRole = authState?.user?.role ?? '';
    const hasHelpdeskAccess = ['moderator', 'admin', 'manager', 'superadmin'].includes(userRole);

    const { data: registrationStatus } = useGetRegistrationStatus();
    const { data: statOverview } = useGetStatOverview();
    const { data: helpdeskData } = useListHelpdeskThreads(1, {}, hasHelpdeskAccess);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const unattendedCount = helpdeskData?.helpdesk_summary_data?.unattended_candidates ?? statOverview?.helpdesk?.unattended_candidates ?? 0;

    const dynamicTabs = useMemo(() => {
        return tabs.map(tab => {
            if (tab.value === 'helpdesk') {
                return {
                    ...tab,
                    label: <HelpdeskLabel unattendedCount={unattendedCount} />
                };
            }
            return tab;
        });
    }, [unattendedCount]);

    let userTabs = getTabsForRole(authState?.user?.role ?? '')

    // Re-map userTabs to include the dynamic HelpdeskLabel with unattendedCount
    userTabs = userTabs.map(userTab => {
        const dynamicTab = dynamicTabs.find(t => t.value === userTab.value);
        return dynamicTab ?? userTab;
    });

    const hasOngoingExams = (statOverview?.exams?.ongoing ?? 0) > 0;
    const isRegistrationOpen = registrationStatus?.candidate_registration?.is_open === true;

    if (hasOngoingExams) {
        // Helpdesk first if exam ongoing, Registration last
        const helpdeskTab = userTabs.find(tab => tab.value === 'helpdesk');
        const registrationTab = userTabs.find(tab => tab.value === 'registration');
        const others = userTabs.filter(tab => tab.value !== 'helpdesk' && tab.value !== 'registration');

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
            {mounted && <TabWrapper tabListClassName='sticky top-0 z-30 flex overflow-x-auto border-b border-gray-300 gap-2 bg-white px-6 font-sans' tabs={userTabs} />}
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

function HelpdeskLabel({ unattendedCount }: { unattendedCount?: number }) {
    return (
        <div className='flex gap-2 items-center'>
            <div className="relative">
                <HelpdeskIcon />
                {unattendedCount && unattendedCount > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-white">
                        {unattendedCount > 99 ? '99+' : unattendedCount}
                    </span>
                ) : null}
            </div>
            <span>Helpdesk</span>
        </div>
    );
}


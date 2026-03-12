import React from 'react'
import UserManagement from './UserManagement';
import AddStaffMember from './AddStaffMember';
import ViewStaffDetailsFromLeaderboard from './StaffDetailsFromLeaderboard'
import { useSearchParams } from 'next/navigation';

export default function StaffMgtWrapper() {
    const searchParams=useSearchParams()
    const currentView = searchParams.get('view');
    const userId = searchParams.get("id");
    return renderAppropriateComponent(currentView,userId);
}



function renderAppropriateComponent(view: string | null, id: string | null) {
    switch (view) {
        case "user-management":
            return <UserManagement />;
        case "add-staff":
            return <AddStaffMember />;
        case "view-user":
            return <ViewStaffDetailsFromLeaderboard id={id!} />;
        default:
            return <UserManagement />;
    }
}
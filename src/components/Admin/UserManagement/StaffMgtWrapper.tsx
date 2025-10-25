import React from 'react'
import UserManagement from './UserManagement';
import AddStaffMember from './AddStaffMember';
import { useSearchParams } from 'next/navigation';

export default function StaffMgtWrapper() {
    const currentView = useSearchParams().get('view');
  return renderAppropriateComponent(currentView);
}



function renderAppropriateComponent(view:string | null) {
    switch (view) {
        case "user-management":
            return <UserManagement />;
         case "add-staff":
            return <AddStaffMember />;
    
        default:
            return <UserManagement />;
    }
}
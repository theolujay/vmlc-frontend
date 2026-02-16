"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import PageLayout from '../Layout/PageLayout'
import Hero from './Hero'
import InfoBoard from './InfoBoard'
import Support from './Support'
import TourGuide from './TourGuide'
import GenericInfoBoard from '../Portal/DashboardParts/InfoBoard';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';
import ProfileModal from '@/components/Modals/ProfileModal';

 function GettingStarted() {
  const {authState}=useAuth()
  const user = useGetCurrentUser();
  const [infoMessage, setInfoMessage] = useState<string | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (user && user.profile && user.profile.is_setup_complete === false) {
      setInfoMessage("Your profile is incomplete. Please update your profile to ensure you don't miss any important updates.");
    }
  }, [user]);

  return (
    <PageLayout>
      <Hero userType={authState!.userType!} />
      
      {infoMessage && (
        <GenericInfoBoard 
          message={infoMessage}
          onDismiss={() => setInfoMessage(undefined)}
          actionLabel="Update Profile"
          onAction={() => setIsProfileOpen(true)}
        />
      )}

      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <InfoBoard/>
        <div className="flex gap-3 flex-col">
          <TourGuide/>
          <Support/>
        </div>
      </div>

      {user?.profile && (
        <ProfileModal 
          id={user.profile.user.id}
          open={isProfileOpen}
          close={setIsProfileOpen}
          isOwnProfile={true}
        />
      )}
    </PageLayout>
  )
}

export default withAuthentication(GettingStarted)

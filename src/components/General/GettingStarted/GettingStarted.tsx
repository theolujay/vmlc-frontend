"use client"
import React from 'react'
import PageLayout from '../Layout/PageLayout'
import Hero from './Hero'
import InfoBoard from './InfoBoard'
import TourGuide from './TourGuide'
import Support from './Support'
import useGetVerificationStatus from '@/hooks/useGetVerificationStatus'
import withAuthentication from '@/hocs/withAuthentication'
import useGetCurrentUser from '@/hooks/useGetCurrentUser'
import { useAuth } from '@/contexts/AuthProvider'

 function GettingStarted() {
  const {data}=useGetVerificationStatus()
  console.log(data,'what is data from here')
  // const userInfo=useGetCurrentUser()
  const {authState}=useAuth()
  console.log(authState,'WHAT IS USER INFO')

  return (
    <PageLayout>
      <Hero userType={authState?.userType!} />
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
        <InfoBoard/>
        <div className="flex gap-3 flex-col">
          <TourGuide/>
          <Support/>
        </div>
      </div>
    </PageLayout>
  )
}

export default withAuthentication(GettingStarted)

"use client"
import React from 'react'
import PageLayout from '../Layout/PageLayout'
import Hero from './Hero'
import InfoBoard from './InfoBoard'
import TourGuide from './TourGuide'
import Support from './Support'
import useGetVerificationStatus from '@/hooks/useGetVerificationStatus'
import withAuthentication from '@/hocs/withAuthentication'

 function GettingStarted() {
  const {data}=useGetVerificationStatus()
  console.log(data,'what is data from here')
  return (
    <PageLayout>
      <Hero/>
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

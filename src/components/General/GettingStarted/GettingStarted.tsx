import React from 'react'
import PageLayout from '../Layout/PageLayout'
import Hero from './Hero'
import InfoBoard from './InfoBoard'
import TourGuide from './TourGuide'
import Support from './Support'

export default function GettingStarted() {
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

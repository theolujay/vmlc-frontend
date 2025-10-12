"use client"
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import useGetVerificationStatus from '@/hooks/useGetVerificationStatus'
import PageLayout from '../Layout/PageLayout'
import Hero from './Hero'
import InfoBoard from './InfoBoard'
import Support from './Support'
import TourGuide from './TourGuide'

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

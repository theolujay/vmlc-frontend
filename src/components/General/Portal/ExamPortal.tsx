"use client"
import React from 'react'
import PageLayout from '../Layout/PageLayout'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import ExamBoard from './ExamBoard'
import LeaderBoard from './LeaderBoard'
import { InfoIcon } from '../GeneralIcon'
import { useAuth } from '@/contexts/AuthProvider'
import withAuthentication from '@/hocs/withAuthentication'
import useGetExamPortal from '@/hooks/useGetExamPortal'

 function ExamPortal() {
  const {data}=useGetExamPortal()
  console.log(data,'what is here currently')
  return (
    <PageLayout>
      <WelcomeBanner />
      <InfoBanner />
      <ExamBoard examList={data?.available_exams} examType={data?.candidate_info.role??''} />
      <LeaderBoard />
    </PageLayout>
  )
}

export default withAuthentication(ExamPortal)

function WelcomeBanner() {
  const {authState}=useAuth()
  return <ResponsiveContainer>
    <h2 className='text-[1.75rem] '>Welcome {authState?.user?.first_name??''}!</h2>
    <p>{`You're`} now in the exam portal. Wishing you success ahead!</p>
  </ResponsiveContainer>
}

function InfoBanner() {
  return <div className="flex px-2 text-white items-center bg-[#099137] rounded-lg ">
    <span><InfoIcon /></span>

    {/* <div className="h-full w-[2px] bg-white mx-2 self-stretch"></div> */}
    <div className='  px-2 '>
      We are excited to let you know that you have advanced to the next stage of the Verbhoheit Mathematics League Competition! Please be aware that the final exam will be held in person. The date and location will be shared promptly through your dashboard and email. Best of luck!
    </div>
    <div className="flex-1 w-[2px] bg-white mx-2"></div>
    <div className="flex gap-1 items-center px-2 flex-col">
      <span className='font-bold text-5xl'>00</span>
      <span className='text-center'>days left</span>
    </div>
  </div>
}
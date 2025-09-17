import React from 'react'
import PageLayout from '../Layout/PageLayout'
import ResponsiveContainer from '@/components/ui/RoundedContainer'
import ExamBoard from './ExamBoard'

export default function ExamPortal() {
  return (
    <PageLayout>
       <WelcomeBanner/>
       <ExamBoard/>
    </PageLayout>
  )
}


function WelcomeBanner(){
    return <ResponsiveContainer>
        <h2 className='text-[1.75rem]'>Welcome Ezekiel!</h2>
        <p>{`You'r`}e now in the exam portal. Wishing you success ahead!</p>
       
    </ResponsiveContainer>
}
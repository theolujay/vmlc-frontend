import React from 'react'
import { Trophy } from './GettingStartedAssets'


export default function Hero() {
  return (
    <div className='flex gap-2 bg-[#2C2D6A] items-center p-4 rounded-[24px]'>
        <div className="info flex flex-col gap-1 text-white  flex-1">
            <h2 className='text-[32px]'>Welcome to the candidate portal get started page</h2>
            <p>Prepare for an exciting adventure! This page will help you navigate the Verboheit Mathematics League Competition candidate portal, complete your verification smoothly, and take your league exams. Best of luck!</p>
        </div>
        <div className="hidden md:flex">
            <Trophy/>
        </div>
    </div>
  )
}

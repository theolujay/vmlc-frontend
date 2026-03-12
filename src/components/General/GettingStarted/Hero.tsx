import React from 'react'
import { StaffHeroIcon, Trophy } from './GettingStartedAssets'



export default function Hero({ userType }: { userType: string }) {
  return userType == 'candidate' ? <StudentHero /> : <StaffHero />
}

export function StudentHero() {
  return (
    <div className='flex gap-2 bg-[#2C2D6A] items-center p-4 rounded-[24px]'>
      <div className="info flex flex-col gap-1 text-white  flex-1">
        <h2 className='text-[32px]'>Get started!</h2>
        <p>Your journey starts here. Use this page to navigate the Verboheit Mathematics League Competition.</p>
      </div>
      <div className="hidden md:flex">
        <Trophy />
      </div>
    </div>
  )
}




export function StaffHero() {
  return (
    <div className='flex gap-2 bg-[#00222F] items-center p-4 rounded-[24px]'>
      <div className="info flex flex-col gap-1 text-white  flex-1">
        <h2 className='text-[32px]'>Get started</h2>
        <p>{`You’re`} an essential part of this journey. Use this page to navigate the Verboheit Mathematics League Competition as a volunteer.
        </p>
      </div>
      <div className="hidden md:flex">
        <StaffHeroIcon />
      </div>
    </div>
  )
}

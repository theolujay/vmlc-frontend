import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { GotoIcon, ReadIcon } from './GettingStartedAssets'
import Link from 'next/link'

export default function TourGuide() {
  return (
    <ResponsiveContainer>
        <div className="flex flex-col gap-2">
            <div><ReadIcon/></div>
            <p className='font-bold text-lg'>Tour Guide</p>
            <p>Learn what you can do with the Verboheit Mathematics League Competition (VMLC) staff portal.</p>
            <Link href='/' className='text-sm flex gap-1 items-center text-[#018ABB]'><span>Take a tour</span><span><GotoIcon/></span></Link>
        </div>
    </ResponsiveContainer>
  )
}

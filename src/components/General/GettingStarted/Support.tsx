import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { GotoIcon, ReadIcon } from './GettingStartedAssets'
import Link from 'next/link'

export default function Support() {
  return (
    <ResponsiveContainer>
        <div className="flex flex-col gap-2">
            <div><ReadIcon/></div>
            <p className='font-bold text-lg'>FAQs / Support</p>
            <p>Find answers to questions you might have or get in touch</p>
            <Link href='/' className='text-sm flex gap-1 items-center text-[#018ABB]'><span>Go to support</span><span><GotoIcon/></span></Link>
        </div>
    </ResponsiveContainer>
  )
}

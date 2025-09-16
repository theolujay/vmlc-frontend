import { NotificationIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import Logo from '@/components/ui/SvgAsset/Logo'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <header className='flex bg-white py-0 px-[24px]  items-center justify-center'>
       <div className="flex mx-auto justify-between w-full py-4">
        <Link href='/'>
        <Logo/>
        </Link>
        <nav className='flex justify-between items-center gap-6'>
          <span className='br-2'>
            <NotificationIcon/>
          </span>
          <div className="flex gap-3">

          <div className="flex gap-1 flex-col">
            <span>Ezekiel Oluwadamilare</span>
            <span className='text-[12px]'>Candidate</span>
          </div>

          <div className='bg-[#CCEEFB] w-[44px] h-[44px] rounded-full'>

          </div>
          </div>
        </nav>
        </div> 
    </header>
  )
}

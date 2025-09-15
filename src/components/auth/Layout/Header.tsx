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
          <Link href='/'>About the Competition</Link>
          <Link href='/'>Competition Stages</Link>
        </nav>
        </div> 
    </header>
  )
}

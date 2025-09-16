import { NotificationIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import Logo from '@/components/ui/SvgAsset/Logo'
import Link from 'next/link'
import React from 'react'

export default function Header() {
    const userName = 'Ezekiel Oluwadamilare'
    const userInitials = userName.split(' ').map((val) => val[0]).join('');
    return (
        <header className='flex bg-white py-0 px-[24px]  items-center justify-center'>
            <div className="flex mx-auto justify-between w-full py-4">
                <Link href='/'>
                    <Logo />
                </Link>
                <nav className='flex justify-between items-center gap-6'>
                    <span className='br-2'>
                        <NotificationIcon />
                    </span>
                    <div className="flex gap-3">

                        <div className="flex flex-col">
                            <span className=''>{userName}</span>
                            <span className='text-[12px]'>Candidate</span>
                        </div>

                        <div className='bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full'>
                            <span className='font-[700] text-[20px]'>

                                {userInitials}
                            </span>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

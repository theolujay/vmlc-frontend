
"use client"

import AppDropdown from '@/components/ui/Dropdown/AppDropdown'
import { NotificationIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import Logo from '@/components/ui/SvgAsset/Logo'
import { useAuth } from '@/contexts/AuthProvider'
import useGetCurrentUser from '@/hooks/useGetCurrentUser'
import { getUserInitials } from '@/utils/capitalizeWords'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    

    const currentUser=useGetCurrentUser()
    
    const userName = [currentUser?.profile.user?.first_name, currentUser?.profile?.user?.last_name].join(' ')

    const {authState}=useAuth()
   
    const userInitials=getUserInitials(userName)
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <header className="flex bg-white px-6 items-center">
            <div className="flex mx-auto justify-between w-full py-4">
                {/* Logo */}
                <Link href="/">
                    <Logo />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex justify-between  items-center gap-6">
                    <span>
                        <NotificationIcon />
                    </span>
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col">
                            <span className="font-medium">{userName}</span>
                            <span className="text-xs text-gray-500">{authState?.user?.role}</span>
                        </div>
                        <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full">
                            <span className="font-bold text-lg">{userInitials}</span>
                        </div>
                        <AppDropdown/>
                    </div>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 border rounded-md"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {/* hamburger icon */}
                    <div className="space-y-1">
                        <span className="block w-6 h-0.5 bg-gray-700"></span>
                        <span className="block w-6 h-0.5 bg-gray-700"></span>
                        <span className="block w-6 h-0.5 bg-gray-700"></span>
                    </div>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md p-4 flex flex-col gap-4 md:hidden">
                    <span className="flex items-center gap-2">
                        <NotificationIcon /> Notifications
                    </span>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-3">

                        <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full">
                            <span className="font-bold text-lg">{userInitials}</span>
                            
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">{userName}</span>
                            <span className="text-xs text-gray-500">{authState?.user?.role}</span>
                        </div>
                        </div>
                        <AppDropdown/>
                    </div>
                </div>
            )}
        </header>
    )
}

"use client"

import AppDropdown from '@/components/ui/Dropdown/AppDropdown'
import { NotificationIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import Logo from '@/components/ui/SvgAsset/Logo'
import { useAuth } from '@/contexts/AuthProvider'
import useGetCurrentUser from '@/hooks/useGetCurrentUser'
import { getUserInitials } from '@/utils/capitalizeWords'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/contexts/NotificationProvider'
import NotificationModal from '@/components/Admin/Announcement/NotificationModal'

export default function Header() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const currentUser=useGetCurrentUser()
    
    const userName = currentUser?.profile.user?.first_name 
        ? [currentUser?.profile.user?.first_name, currentUser?.profile?.user?.last_name].join(' ')
        : '';

    const {authState}=useAuth()
   
    const userInitials=getUserInitials(userName)
    const [menuOpen, setMenuOpen] = useState(false)
    const { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        clearAll, 
        inAppNotificationsEnabled, 
        toggleInAppNotifications 
    } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);

    
    return (
        <header className="flex bg-white px-6 items-center relative z-40">
            <div className="flex mx-auto justify-between w-full py-4">
                {/* Logo */}
                <Link href="/">
                    <Logo />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex justify-between  items-center gap-6">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full cursor-pointer"
                    >
                        <NotificationIcon />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <div className="flex gap-3 items-center">
                        <div className="flex flex-col">
                            <span className="font-medium">{mounted ? userName : ''}</span>
                            <span className="text-xs text-gray-500">{mounted ? authState?.user?.role : ''}</span>
                        </div>
                        <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full relative overflow-hidden">
                            {mounted && currentUser?.profile?.user?.profile_picture ? (
                                <Image
                                    src={currentUser.profile.user.profile_picture}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="font-bold text-lg">{mounted ? userInitials : ''}</span>
                            )}
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

            {/* Notification Modal (Shared) */}
            {showNotifications && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <NotificationModal
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                        onMarkAllRead={markAllAsRead}
                        onMarkSingleRead={markAsRead}
                        onClearAll={clearAll}
                        inAppEnabled={inAppNotificationsEnabled}
                        onToggleInApp={toggleInAppNotifications}
                    />
                </>
            )}

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md p-4 flex flex-col gap-4 md:hidden">
                    <button 
                        onClick={() => {
                            setShowNotifications(true);
                            setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left cursor-pointer"
                    >
                        <div className="relative">
                            <NotificationIcon />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[20px] flex items-center justify-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <span>Notifications</span>
                    </button>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-3">

                        <div className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full relative overflow-hidden">
                            {mounted && currentUser?.profile?.user?.profile_picture ? (
                                <Image
                                    src={currentUser.profile.user.profile_picture}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="font-bold text-lg">{mounted ? userInitials : ''}</span>
                            )}
                            
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">{mounted ? userName : ''}</span>
                            <span className="text-xs text-gray-500">{mounted ? authState?.user?.role : ''}</span>
                        </div>
                        </div>
                        <AppDropdown/>
                    </div>
                </div>
            )}
        </header>
    )
}
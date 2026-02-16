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
import ProfileModal from '@/components/Modals/ProfileModal'

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
    const { 
        notifications, 
        markAsRead, 
        markAllAsRead, 
        clearAll, 
        inAppNotificationsEnabled, 
        toggleInAppNotifications,
        isLoading
    } = useNotifications();

    const filteredUnreadCount = notifications.filter(n => {
        const type = (n.type || '').toLowerCase();
        return !n.is_read_by_recipient && type !== 'info' && type !== 'success';
    }).length;

    const [showNotifications, setShowNotifications] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    
    return (
        <header className="flex bg-white px-6 items-center relative z-40">
            <div className="flex mx-auto justify-between w-full py-4">
                {/* Logo */}
                <Link href="/">
                    <div className="md:w-auto">
                        <Logo className="w-full h-auto"/>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="flex justify-between items-center gap-2 md:gap-6">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full min-w-[4px] cursor-pointer"
                    >
                        <NotificationIcon />
                        {filteredUnreadCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] font-bold px-1 py-0 rounded-full border border-white min-w-[16px] h-4 flex items-center justify-center">
                            {filteredUnreadCount > 5 ? '5+' : filteredUnreadCount}
                            </span>
                        )}
                    </button>
                    <div className="flex gap-3 items-center">
                        <div className="hidden md:flex flex-col">
                            <span className="font-medium">{mounted ? userName : ''}</span>
                            <span className="text-xs text-gray-500">{mounted ? authState?.user?.role : ''}</span>
                        </div>
                        <button 
                            onClick={() => setProfileOpen(true)}
                            className="bg-[#CCEEFB] flex items-center justify-center w-[44px] h-[44px] rounded-full relative overflow-hidden cursor-pointer outline-none hover:ring-2 hover:ring-[#CCEEFB] transition-all"
                        >
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
                        </button>
                        <AppDropdown/>
                    </div>
                </nav>
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
                        isLoading={isLoading}
                    />
                </>
            )}

            {currentUser?.profile?.user?.id && (
                <ProfileModal 
                    id={currentUser.profile.user.id} 
                    open={profileOpen} 
                    close={setProfileOpen} 
                    isOwnProfile={true}
                />
            )}
        </header>
    )
}
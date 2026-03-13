import React, { ReactNode } from 'react'
import Header from '../General/Layout/Header'
// import Header from './Header'

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className='flex bg-[#f0f2f5] h-screen w-full flex-col overflow-hidden'>
            <Header />
            <main className='flex-1 overflow-y-auto'>
                {children}
            </main>
        </div>
    )
}

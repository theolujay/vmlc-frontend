import React from 'react'
import Header from '../General/Layout/Header'
import HeaderTimer from './HeaderTimer'

export default function ExamLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='flex bg-[#f0f2f5] w-full flex-col '>
            <Header />
            <HeaderTimer />
            <main className='min-h-[100vh]'>
                <div className="flex gap-2 flex-col  mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}



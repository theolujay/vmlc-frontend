import React, { ReactNode } from 'react'
import Header from './Header'

export default function PageLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className='flex bg-[#f0f2f5] w-full flex-col '>
            <Header />
            <main className='min-h-[100vh]'>
                <div className="flex gap-2 flex-col max-w-[95%] my-3 mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

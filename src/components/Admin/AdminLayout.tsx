import React, { ReactNode } from 'react'
import Header from '../General/Layout/Header'
// import Header from './Header'

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <div className='flex bg-[#f0f2f5] py-5 w-full flex-col '>
            <Header />
            <main className='min-h-screen'>
                {/* <div className="flex gap-2 flex-col max-w-[95%] my-3 mx-auto"> */}
                    {children}
                {/* </div> */}
            </main>
        </div>
    )
}

import ExamNavigationProvider from '@/contexts/ExamNavigationProvider'
import React from 'react'
import Header from '../General/Layout/Header'
import HeaderTimer from './HeaderTimer'
import FaceProctor from './FaceProctor'

export default function ExamLayout({ 
    children, 
    timer, 
    deadline,
    onTimeUp, 
    title 
}: Readonly<{ 
    children: React.ReactNode, 
    timer: number, 
    deadline?: string,
    onTimeUp: () => void, 
    title?: string 
}>) {

    return (
        <div className='flex min-h-screen w-full flex-col bg-[#F7F9FC]'>
            <ExamNavigationProvider>
                <div className='sticky top-0 z-40'>
                    <Header />
                    <HeaderTimer onTimeUp={onTimeUp} timer={timer} deadline={deadline} title={title} />
                </div>
                <main className='flex-1 py-10 relative'>
                    <div className="max-w-[1400px] w-[95%] mx-auto">
                        {children}
                    </div>
                    <FaceProctor />
                </main>
            </ExamNavigationProvider>
        </div>
    )
}



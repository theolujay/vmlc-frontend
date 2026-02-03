import ExamNavigationProvider from '@/contexts/ExamNavigationProvider'
import React from 'react'
import Header from '../General/Layout/Header'
import HeaderTimer from './HeaderTimer'

export default function ExamLayout({ children, timer, onTimeUp, title }: Readonly<{ children: React.ReactNode, timer: number, onTimeUp: () => void, title?: string }>) {

    return (
        <div className='flex min-h-screen w-full flex-col bg-[#F7F9FC]'>
            <Header />
            <ExamNavigationProvider>
                <HeaderTimer onTimeUp={onTimeUp} timer={timer} title={title} />
                <main className='flex-1 py-10'>
                    <div className="max-w-[1400px] w-[95%] mx-auto">
                        {children}
                    </div>
                </main>
            </ExamNavigationProvider>
        </div>
    )
}



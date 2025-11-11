import ExamNavigationProvider from '@/contexts/ExamNavigationProvider'
import React from 'react'
import Header from '../General/Layout/Header'
import HeaderTimer from './HeaderTimer'

export default function ExamLayout({ children, timer, onTimeUp }: Readonly<{ children: React.ReactNode, timer: number, onTimeUp: () => void }>) {

    return (
        <div className='flex  w-full flex-col '>
            <Header />
            <ExamNavigationProvider>
                <HeaderTimer onTimeUp={onTimeUp} timer={timer} />
                <main className='h-[75vh]'>
                    <div className="flex gap-2 flex-col  mx-auto">
                        {children}
                    </div>
                </main>
            </ExamNavigationProvider>
        </div>
    )
}



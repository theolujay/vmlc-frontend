import React from 'react'
import AdminHeader from '../AdminHeader'
import Button from '@/components/ui/Button'
import { CandidateIcon } from '../AdminIcons'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import QuestionsTable from '../QuestionsTable'

export default function ViewDetails() {
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport={false} label='Leaderboards' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span><CandidateIcon /></span><span>View Candidate Profile</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <CandidateInfoCard />
                <QuestionsTable/>
            </div>
        </div>
    )
}



function CandidateInfoCard() {
    return <ResponsiveContainer className='flex flex-col'>
        <h2>Candidate Info</h2>
        <div className="flex">
            <div className="flex">
                <span>icon</span>
                <div className="flex flex-col">
                    <span className='text-sm'>NAME OF CANDIDATE</span>
                    <p>Simon Kawu</p>
                </div>
            </div>
            <div className="flex">
                <span>icon</span>
                <div className="flex flex-col">
                    <span className='text-sm'>POSITION</span>
                    <p>4TH</p>
                </div>
            </div>
            <div className="flex">
                <span>icon</span>
                <div className="flex flex-col">
                    <span className='text-sm'>START TIME</span>
                    <p>09:00:08 AM</p>
                </div>
            </div>
            <div className="flex">
                <span>icon</span>
                <div className="flex flex-col">
                    <span className='text-sm'>EXAM END TIME</span>
                    <p>09:00:08 AM</p>
                </div>
            </div>
        </div>
    </ResponsiveContainer>
}



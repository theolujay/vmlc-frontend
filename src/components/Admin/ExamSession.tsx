import React, { useState } from 'react'
import AdminHeader from './AdminHeader'
import Button from '../ui/Button'
import ResponsiveContainer from '../ui/ResponsiveContainer'
import QuestionsTable from './QuestionsTable'
// import { AddIcon } from '../General/GettingStarted/GettingStartedAssets'




export default function ExamSession() {
  
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Exam System' actionButton={[<Button key='button-one' className="inline-flex gap-2 border px-2 items-center text-sm"><span>UPLOAD</span></Button>,<Button key='button-two' className='inline-flex flex-col p-2 border rounded-lg border-[#D0D5DD]'>
        <span className='w-1 h-1 rounded-md bg-black'></span>
        <span className='w-1 h-1 rounded-md bg-black'></span>
        <span className='w-1 h-1 rounded-md bg-black' ></span>
        </Button>]} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <SessionDetails/>
      </div>
    </div>
  )
}


function SessionDetails(){
    return <ResponsiveContainer className='gap-2 p-4 flex flex-col'>
        <div className="flex justify-between">
            <div className='flex flex-col gap-1'> 
                <p className='text-sm'>EXAM TITLE</p>
                <h2 className='font-bold text-2xl'>Screening Exam</h2>
            </div>
            <div className="flex flex-col gap-1">
                <span className='text-sm'>DATE CREATED</span>
                <span>08 July, 2025</span>
            </div>
        </div>
        <div className="flex flex-col">
            <p className='text-sm'>DESCRIPTION</p>
        <p>Preliminary exam to determine candidates qualified for the league stage.</p>
        </div>
        <QuestionsTable/>
    </ResponsiveContainer>
}
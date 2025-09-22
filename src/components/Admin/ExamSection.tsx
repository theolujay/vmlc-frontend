import React from 'react'
import AdminHeader from './AdminHeader'
import Button from '../ui/Button'

export default function ExamSection() {
  return (
    <div className='flex flex-col gap-1 '>
            <AdminHeader label='Exam System' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm">CREATE EXAM SESSION</Button> } />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
               
            </div>
        </div>
  )
}

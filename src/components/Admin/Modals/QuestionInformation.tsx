import Drawer from '@/components/ui/Drawer/Drawer'
import React from 'react'
import { CloseIcon } from '../AdminIcons'

export default function QuestionInformation({difficulty,question}:{difficulty:string,question:string}) {
  return (
    <Drawer open={true} onClose={() => {}}>
        <div className="flex flex-col">
            <div className="header border-b py-1 justify-between border-[#E4E7EC] flex ">
                <div className="flex flex-col gap-0.5">
                <h2 className="font-bold text-lg">Question Information</h2>
                <p className="text-sm text-gray-500">This contains the clicked question information</p>
                </div>
                <button className='inline-flex gap-2 border rounded-md border-[#D0D5DD] items-center p-2  cursor-pointer'><span><CloseIcon/></span><span>Close</span></button>
            </div>

            <div className="body flex flex-col gap-3 mt-3 border-[#D0D5DD] border-b">
            <div className=" flex flex-col gap-0.5 mt-3">
                <span className='text-sm text-[#344054]'>QUESTION DIFFICULTY</span>
                <span>{difficulty}</span>
            </div>
             <div className=" flex flex-col gap-0.5 mt-3">
                <span className='text-sm text-[#344054]'>QUESTION</span>
                <span>{question}</span>
            </div>
            <div className=" flex flex-col gap-0.5 mt-3">
                <span className='text-sm text-[#344054]'>OPTIONS</span>
                <span>{question}</span>
            </div>

            <div className=" flex flex-col gap-0.5 mt-3">
                <span className='text-sm text-[#344054]'>ANSWER</span>
                <span>{question}</span>
            </div>
            </div>

        </div>
    </Drawer>
  )
}

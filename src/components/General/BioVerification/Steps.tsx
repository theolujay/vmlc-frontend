import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { CaptureIcon, DocumentIcon } from '../GeneralIcon'



const steps=[{label:'Upload Document',icon:<DocumentIcon/>},{label:'Capture Face',icon:<CaptureIcon/>}]
export default function Steps() {
  return (
   <ResponsiveContainer>
    {steps.map((val,index)=><div key={`steps-${index}`} className='flex items-start relative pb-10 gap-2' >
         {index !== steps.length - 1 && (
            <div className="absolute left-4.5 top-10 w-px  h-[55%] border-l border-dashed border-gray-300" />
          )}
        <span className='border border-[#018ABB] rounded-lg inline-flex items-center w-[40px] h-[40px] px-2'>{val.icon}</span>
        <div className="flex gap-0.5 flex-col">
            <span>Step {index+1}</span>
            <span className='font-bold '>{val.label}</span>
        </div>
    </div>)}
   </ResponsiveContainer>
  )
}

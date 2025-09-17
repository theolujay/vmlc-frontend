import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { DeleteIcon, TrustIcon, UploadDocumentIcon, UploadIcon } from '../GeneralIcon'

export default function UploadCard() {
    return (
        <ResponsiveContainer className='col-span-2 gap-4 '>
            <div className="flex border-b border-[#E4E7EC]">
                <p className='text-xl '>Upload Identification Card</p>
            </div>
            <div className='flex flex-col items-center gap-2 justify-center'>

                <UploadIsland />
                <UploadZone />
            </div>
            <div className="flex gap-1 flex-col">
                <p className='font-bold'>Verification Requirement</p>
                <p>To continue with the verification process, please upload one of the following documents: your passport, or National Identification Number (NIN).</p>
            </div>
            <div className="flex bg-[#E6F4ED] p-3 gap-3 items-center rounded-lg ">
                <span><TrustIcon /></span>
                <p>To ensure your identity and protect your account, we require ID verification. The ID we capture is solely for the purpose of verification.</p>
            </div>
        </ResponsiveContainer>
    )
}


function UploadIsland() {
    return <div className='bg-[#F5FCFE] gap-3 w-[60%] flex-col items-center flex rounded-xl '>
        <span>
            <UploadIcon />
        </span>
        <div className="flex">
            <input type="file" name="" id="upload" className='hidden' />
            <label htmlFor="upload" className='text-balance'>
                <span className='font-bold text-[#018ABB] cursor-pointer mr-3'>Click to upload</span><span>or drag and drop <br /> SVG, PNG, JPG or PDF (max. 2MB)</span>
            </label>
        </div>
    </div>
}


function UploadZone() {

    return <div className='border-[#018ABB] border gap-3 p-2 w-[60%] flex-col items-center flex rounded-xl '>
        <div className="flex justify-between w-full">
            <div className="flex gap-2">
                <span>
                    <UploadDocumentIcon />
                </span>
                <div className="flex  flex-col">
                    <span className=' font-normal'>NIN.pdf</span>
                    <span className='text-sm'>200kb</span>
                </div>
            </div>
            <button className='cursor-pointer' onClick={()=>alert('I was clicked')}><DeleteIcon /></button>
        </div>
        <div className="progress flex w-full items-center justify-center gap-2">
            <div className='w-3/4 h-2 rounded-md bg-[#018ABB]'></div>
            <span>100%</span>
        </div>
    </div>
}
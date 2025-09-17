import ResponsiveContainer from '@/components/ui/RoundedContainer'
import React from 'react'
import { TrustIcon, UploadIcon } from '../GeneralIcon'

export default function UploadCard() {
  return (
  <ResponsiveContainer className='col-span-2 gap-4 '>
    <div className="flex border-b border-[#E4E7EC]">
        <p className='text-xl '>Upload Identification Card</p>
    </div>
    <div className='flex items-center justify-center'>

    <UploadIsland/>
    </div>
    <div className="flex gap-1 flex-col">
        <p className='font-bold'>Verification Requirement</p>
        <p>To continue with the verification process, please upload one of the following documents: your passport, or National Identification Number (NIN).</p>
    </div>
    <div className="flex bg-[#E6F4ED] p-3 gap-3 items-center rounded-lg ">
        <span><TrustIcon/></span>
        <p>To ensure your identity and protect your account, we require ID verification. The ID we capture is solely for the purpose of verification.</p>
    </div>
  </ResponsiveContainer>
  )
}


 function UploadIsland(){
return <div className='bg-[#F5FCFE] gap-3 w-1/2 flex-col items-center flex rounded-xl '>
<span>
    <UploadIcon/>
</span>
<div className="flex">
    <input type="file" name="" id="upload" className='hidden' />
    <label htmlFor="upload" className='text-balance'>
        <span className='font-bold text-[#018ABB] cursor-pointer mr-3'>Click to upload</span><span>or drag and drop <br /> SVG, PNG, JPG or PDF (max. 2MB)</span>
    </label>
</div>
</div>
}

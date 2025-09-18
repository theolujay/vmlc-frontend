"use client"
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import { useState } from "react";
import { CaptureZoneIcon, TrustIcon } from "../GeneralIcon";
import CaptureDialog from "./CaptureDialog";

export default function CaptureFaceCard() {
    const [open,setOpen]=useState(true)
    return (
        <ResponsiveContainer className='col-span-2 gap-4 '>
            <div className="flex border-b border-[#E4E7EC]">
                <p className='text-xl '>Capture face</p>
            </div>
            <div className='flex flex-col items-center gap-2 justify-center'>

                
                <CaptureZone />
            </div>
            <div className="flex gap-1 flex-col">
                <p className='font-bold'>Verification of Facial Features</p>
                <p>To confirm that the current operation is being carried out by the account holder with the right set of permissions, we need to verify your identity through facial recognition.</p>
            </div>
            <div className="flex bg-[#E6F4ED] p-3 gap-3 items-center rounded-lg ">
                <span><TrustIcon /></span>
                <p>To ensure your identity and protect your account, we require face verification. The facial image we capture is solely for the purpose of verification and profile picture.</p>
            </div>
            <CaptureDialog close={setOpen} open={open}/>
        </ResponsiveContainer>
    )
}



function CaptureZone() {

    return <div className=' gap-3 p-2 w-[60%] flex-col items-center flex rounded-xl '>
        <div>
            <CaptureZoneIcon/>
        </div>
    </div>
}
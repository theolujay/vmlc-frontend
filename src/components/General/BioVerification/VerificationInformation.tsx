"use client"
import React from 'react'
import PageLayout from '../Layout/PageLayout'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { capitalizeWord } from '@/utils/capitalizeWords'
import { GreaterThanIcon, HomeIcon } from '../GettingStarted/GettingStartedAssets'
import Button from '@/components/ui/Button'
import Steps from './Steps'
import UploadCard from './UploadCard'

export default function VerificationInformation() {
    return (
        <PageLayout>
            <BreadCrumbHeader />
            <div className="grid grid-cols-3 items-start gap-3">
                <Steps/>
                <UploadCard/>
            </div>
        </PageLayout>
    )
}


function BreadCrumbHeader() {
    const pathName = usePathname()
    const pathSegments = pathName.split('/').filter(Boolean);
   
    return <div className='flex justify-between'>
        <div className="flex flex-col gap-0.5">
            <p className='font-normal text-2xl'>Provide Verification Information</p>
            <div className="flex gap-2">
                <ol className='flex'>
                    {pathSegments.map((segment, index) => {
                        const href = '/' + pathSegments.slice(0, index + 1).join('/');
                        const isLast = index == pathSegments.length - 1;
                        const decodeHref = decodeURIComponent(segment)

                        if (index==0) {
                          return <li key={href} className='inline-flex items-center justify-between text-[#667185] gap-1 px-1'>
                            <span><HomeIcon/></span>
                           <Link href={href}>{capitalizeWord(decodeHref)}</Link>
                        </li>   
                        }
                        return <li key={href} className='inline-flex justify-between px-1 items-center gap-1'>
                            <span><GreaterThanIcon/></span>
                            {isLast ? <span>{capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
                        </li>
                    })}
                </ol>
                {/* {pathSegment.map((val,index)=><span key={`path-${index}`}>{val}</span>)} */}
            </div>

        </div>
        <div>
        <Button className='px-2 text-sm'>Upload</Button>
        </div>
        {/* <button>Upload</button> */}
    </div>
}
"use client"
import Button from '@/components/ui/Button'
import { capitalizeWord } from '@/utils/capitalizeWords'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GreaterThanIcon, HomeIcon } from '../GettingStarted/GettingStartedAssets'
import PageLayout from '../Layout/PageLayout'
import Steps from './Steps'
import UploadCard from './UploadCard'
import CaptureFaceCard from './CaptureFace'

export default function VerificationInformation() {
    return (
        <PageLayout>
            <BreadCrumbHeader />
            <div className="grid grid-cols-3 items-start gap-3">
                <Steps />
                {/* <UploadCard /> */}
                <CaptureFaceCard/>
            </div>
        </PageLayout>
    )
}


function BreadCrumbHeader() {
    const pathName = usePathname()
    const pathSegments = pathName.split('/').filter(Boolean);

    return <div className='flex justify-between items-center'>
        <div className="flex flex-col gap-0.5">
            <p className='font-normal text-2xl'>Provide Verification Information</p>
            <div className="flex gap-2">
                <ol className='flex'>
                    {pathSegments.map((segment, index) => {
                        const href = '/' + pathSegments.slice(0, index + 1).join('/');
                        const isLast = index == pathSegments.length - 1;
                        const decodeHref = decodeURIComponent(segment)

                        if (index == 0) {
                            return <li key={href} className='inline-flex items-center justify-between text-[#667185] gap-1 px-1'>
                                <span><HomeIcon /></span>
                                <Link href={href}>{capitalizeWord(decodeHref)}</Link>
                            </li>
                        }
                        return <li key={href} className='inline-flex justify-between px-1 items-center gap-1'>
                            <span><GreaterThanIcon /></span>
                            {isLast ? <span>{capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
                        </li>
                    })}
                </ol>
            </div>

        </div>
        <div>
            <Button className='px-2 text-sm'>Upload</Button>
        </div>
        {/* <button>Upload</button> */}
    </div>
}
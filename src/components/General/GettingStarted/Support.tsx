import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import { SupportIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import Link from 'next/link'
import { GotoIcon } from './GettingStartedAssets'

export default function Support() {
  return (
    <ResponsiveContainer>
        <div className="flex flex-col gap-2">
            <div><SupportIcon/></div>
            <p className='font-bold text-lg'>FAQs / Helpdesk</p>
            <p>Find answers to questions you might have or get in touch</p>
            <Link href='/' className='text-sm flex gap-1 items-center text-[#018ABB]'><span>Go to helpdesk</span><span><GotoIcon/></span></Link>
        </div>
    </ResponsiveContainer>
  )
}

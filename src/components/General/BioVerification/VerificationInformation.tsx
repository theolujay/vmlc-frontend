"use client"
import BreadCrumbHeader from '@/components/ui/BreadCrumbHeader'
import Steps from '@/components/ui/Steps/Steps'
import { StepType } from '@/types/step'
import { CaptureIcon, DocumentIcon } from '../GeneralIcon'
import PageLayout from '../Layout/PageLayout'
import CaptureFaceCard from './CaptureFace'
import UploadCard from './UploadCard'
import Button from '@/components/ui/Button'


const steps:StepType[]=[{button: <Button className='px-2 text-sm'>UPLOAD</Button>,label:'Upload Document',icon:<DocumentIcon/>,component:<UploadCard/>,activeTab:true},{button: <Button className='px-2 text-sm'>PROCEED TO CAPTURE</Button>,label:'Capture Face',icon:<CaptureIcon/>,component:<CaptureFaceCard/>,activeTab:false}]
const currentStep = steps.find(step => step.activeTab)
export default function VerificationInformation() {
    return (
        <PageLayout>
            <BreadCrumbHeader button={currentStep?.button} />
           <Steps steps={steps} />
        </PageLayout>
    )
}



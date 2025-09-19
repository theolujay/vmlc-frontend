"use client"
import BreadCrumbHeader from '@/components/ui/BreadCrumbHeader'
import Steps from '@/components/ui/Steps/Steps'
import { StepType } from '@/types/step'
import { CaptureIcon, DocumentIcon } from '../GeneralIcon'
import PageLayout from '../Layout/PageLayout'
import CaptureFaceCard from './CaptureFace'
import UploadCard from './UploadCard'


const steps:StepType[]=[{label:'Upload Document',icon:<DocumentIcon/>,component:<UploadCard/>,activeTab:true},{label:'Capture Face',icon:<CaptureIcon/>,component:<CaptureFaceCard/>,activeTab:false}]
export default function VerificationInformation() {
    return (
        <PageLayout>
            <BreadCrumbHeader />
           <Steps steps={steps} />
        </PageLayout>
    )
}



"use client"
import PageLayout from '../Layout/PageLayout'

import BreadCrumbHeader from '@/components/ui/BreadCrumbHeader'
import Steps from '@/components/ui/Steps/Steps'
import CaptureFaceCard from '../BioVerification/CaptureFace'
import { CaptureIcon, DocumentIcon } from '../GeneralIcon'



 const steps = [{ label: 'Capture Face',activeTab:true, icon: <DocumentIcon />,component:<CaptureFaceCard/> }, { label: 'Instructions',activeTab:false, icon: <CaptureIcon />,component:<CaptureFaceCard/> }]
export default function ExamVerification() {
    return (
        <PageLayout>
            <BreadCrumbHeader />
           <Steps steps={steps} />
        </PageLayout>
    )
}



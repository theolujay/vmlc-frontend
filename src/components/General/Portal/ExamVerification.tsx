"use client"
import PageLayout from '../Layout/PageLayout'

import BreadCrumbHeader from '@/components/ui/BreadCrumbHeader'
import Steps from '@/components/ui/Steps/Steps'
import CaptureFaceCard from '../BioVerification/CaptureFace'
import { CaptureIcon, DocumentIcon, InstructionIcon } from '../GeneralIcon'
import InstructionCard from './InstructionCard'
import Button from '@/components/ui/Button'






const steps = [{ button: <Button className='px-2 text-sm'>PROCEED TO VERIFY</Button>, label: 'Capture Face', activeTab: false, icon: <DocumentIcon />, component: <CaptureFaceCard /> }, { button: <Button className='px-2 text-sm'>START EXAMS</Button>, label: 'Instructions', activeTab: true, icon: <InstructionIcon />, component: <InstructionCard /> }]
const currentStep = steps.find(step => step.activeTab)
export default function ExamVerification() {

    return (
        <PageLayout>
            <BreadCrumbHeader button={currentStep?.button} />
            <Steps steps={steps} />
        </PageLayout>
    )
}



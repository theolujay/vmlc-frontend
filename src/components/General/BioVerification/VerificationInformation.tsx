"use client"
import BreadCrumbHeader from '@/components/ui/BreadCrumbHeader'
import Button from '@/components/ui/Button'
import Steps from '@/components/ui/Steps/Steps'
import withAuthentication from '@/hocs/withAuthentication'
import { VerificationDocumentType } from '@/types/Index'
import { StepType } from '@/types/step'
import { useState } from 'react'
import { CaptureIcon, DocumentIcon } from '../GeneralIcon'
import PageLayout from '../Layout/PageLayout'
import CaptureFaceCard from './CaptureFace'
import UploadCard from './UploadCard'
import useUploadVerification from '@/hooks/useUploadVerification'

function VerificationInformation() {
  const [files, setFiles] = useState<VerificationDocumentType>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const { isPending, onSubmit,isSuccess } = useUploadVerification()

  // update a file when uploaded or captured
  function handleFileChange(field: keyof typeof files, file: File | null) {
    setFiles((prev) => ({ ...prev, [field]: file }))
  }



  // move to the next step
  function goToNextStep() {
    setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
  }

  const steps: StepType[] = [
    {
      button: (
        <Button
          className="px-2 text-sm"
          onClick={goToNextStep}
        >
          UPLOAD
        </Button>
      ),
      label: 'Upload Document',
      icon: <DocumentIcon />,
      component: <UploadCard file={files.verification_document} label="Document" onFileChange={(file) => handleFileChange('verification_document', file)} />,
      activeTab: currentStepIndex === 0,
    },
    {
      button: (
        <Button
          className="px-2 text-sm"
          onClick={goToNextStep}
        >
          UPLOAD
        </Button>
      ),
      label: 'Upload ID',
      icon: <DocumentIcon />,
      component: <UploadCard file={files.id_card} label="ID Card" onFileChange={(file) => handleFileChange('id_card', file)} />,
      activeTab: currentStepIndex === 1,
    },
    {
      button: (
        <Button
          className="px-2 text-sm"
          onClick={goToNextStep}
        >
          PROCEED TO CAPTURE
        </Button>
      ),
      label: 'Capture Face',
      icon: <CaptureIcon />,
      component: <CaptureFaceCard isSuccess={isSuccess} isPending={isPending} onCapture={(file) => {
        handleFileChange('face_id', file)
        onSubmit({...files,face_id:file})
      }
      } />,
      activeTab: currentStepIndex === 2,
    },
  ]

  const currentStep = steps[currentStepIndex]

  return (
    <PageLayout>
      <BreadCrumbHeader button={currentStep.button} />
      <Steps steps={steps} />
    </PageLayout>
  )
}

export default withAuthentication(VerificationInformation)

import VerificationMessage from '@/components/General/BioVerification/VerificationMessage';
import { VerificationService } from '@/services/verification.service';
import { VerificationDocumentType } from '@/types/Index';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function useUploadVerification() {
    // const [success,setSuccess]=useState(false)
    const router=useRouter()
    const { isPending, mutate,isSuccess } = useMutation({
        mutationFn: VerificationService.uploadVerificationDocuments,
        onSuccess:()=>{
            // toast(<VerificationMessage/>,{
            //     className:'bg-green-200',
            //     ariaLabel:'Verification successful'
            // })
            toast.success('Verification documents uploaded successfully')
            router.push('/exam-portal')
        },
        onError:(error:AxiosError<any>)=>{
            
            toast.error(error?.response?.data?.detail||'Failed to upload verification documents. Please try again.')
        }

    })

    function onSubmit(value: VerificationDocumentType) {
        const formData = new FormData();
        if (value.face_id) formData.append('face_id', value.face_id);
        if (value.id_card) formData.append('id_card', value.id_card);
        if (value.verification_document) formData.append('verification_document', value.verification_document)
        mutate(formData)
    }



    return { isPending, onSubmit,isSuccess }
}

import { VerificationService } from '@/services/verification.service';
import { VerificationDocumentType } from '@/types/Index';
import { useMutation } from '@tanstack/react-query';

export default function useUploadVerification() {
    // const [success,setSuccess]=useState(false)
    const { isPending, mutate,isSuccess } = useMutation({
        mutationFn: VerificationService.uploadVerificationDocuments,
        // onSuccess:()=>setSuccess(true)
    })

    function onSubmit(value: VerificationDocumentType) {
        const formData = new FormData();
        if (value.profile_photo) formData.append('profile_photo', value.profile_photo);
        if (value.id_card) formData.append('id_card', value.id_card);
        if (value.verification_document) formData.append('verification_document', value.verification_document)
        mutate(formData)

        console.log('we got this as form data',value)
    }



    return { isPending, onSubmit,isSuccess }
}

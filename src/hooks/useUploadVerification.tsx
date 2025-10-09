import { VerificationService } from '@/services/verification.service'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

export default function useUploadVerification() {
    const { isPending, mutate } = useMutation({
        mutationFn:VerificationService.uploadVerificationDocuments
    })

    function onSubmit(value:any){
        mutate(value)
    }



    return {isPending,onSubmit}
}

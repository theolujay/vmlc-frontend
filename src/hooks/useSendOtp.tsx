import { AuthService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import React from 'react'

export default function useSendOtp() {
  const {isPending,mutate}=useMutation({
    mutationFn:AuthService.sendOtp,
  })

  function onSubmit(payload:{email:string}){
    mutate(payload)
  }
  return {isPending,onSubmit}

}

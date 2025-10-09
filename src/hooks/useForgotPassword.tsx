import { AuthService } from '@/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'
import useGetCurrentUser from './useGetCurrentUser'
import { useState } from 'react'


const sendEmailSchema = z.object({
    email: z.email()
})


const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 digits'),

})

const setNewPasswordSchema = z.object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
})
type setNewPasswordSchemaType = z.infer<typeof setNewPasswordSchema>
type otpSchemaType = z.infer<typeof otpSchema>;
type EmailSchemaType = z.infer<typeof sendEmailSchema>
export default function useForgotPassword() {
    const [email,setEmail]=useState('')
    const [otpState, setOtpState] = useState('')
    const currentUser = useGetCurrentUser();
    const sendEmailForm = useForm({
        resolver: zodResolver(sendEmailSchema),
        defaultValues: { email: '' }
    })
    const otpForm = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    })
    const setNewPasswordForm = useForm({
        resolver: zodResolver(setNewPasswordSchema),
        defaultValues: {
            new_password: '',
            confirm_password: ''
        }
    })

    const { isPending, mutate } = useMutation({
        mutationFn: AuthService.passwordChange,
        onSuccess: (value) => console.log(value, 'what is value')
    })




    const { mutate: resendMutate, isPending: resendPending } = useMutation({
    mutationFn: AuthService.passwordChangeResendOtp,
    onSuccess: (value) => console.log(value)
  })




    const { isPending: otpPending, mutate: otpMutate } = useMutation({
        mutationFn: AuthService.sendOtpForForgotPassword,
        onSuccess: (value) => console.log(value, 'what is value')
    })


    const { isPending: setNewPasswordPending, mutate: setNewPasswordMutate } = useMutation({
        mutationFn: AuthService.setNewPassword,
        onSuccess: (value) => console.log(value, 'what is value')
    })


    async function onEmailSubmit(value: EmailSchemaType) {
         mutate(value)
    }



    function submitOtpForPasswordChange(value: otpSchemaType) {
        if (!currentUser) {
            throw new Error('No user')
        }
        const payload = {
            email: currentUser.profile.user.email,
            otp: value.otp
        }
        setOtpState(value.otp);
        otpMutate(payload)
    }



    function handleNewPasswordChange(value: setNewPasswordSchemaType) {
        if (!currentUser) {
            throw new Error('No user')
        }
        const payload = {
            email: currentUser.profile.user.email,
            otp: otpState,
            ...value
        }

        setNewPasswordMutate(payload)
    }




    function resendOtpFunction() {
   
    const payload = {
        email
    
    }
    resendMutate(payload)

  }


    return {
        sendEmailForm,
        isPending,
        onEmailSubmit,
        otpPending,
        submitOtpForPasswordChange,
        otpForm,
        setNewPasswordForm,
        setNewPasswordPending,
        handleNewPasswordChange,
        email,setEmail,
        resendPending,
        resendOtpFunction
    }
}

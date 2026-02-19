import { AuthService } from '@/services/auth.service'
import { ApiError } from '@/types/Index'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'



const sendEmailSchema = z.object({
    email: z.string().email()
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
export default function useForgotPassword(callbacks?: {
    onEmailSuccess?: () => void,
    onOtpSuccess?: () => void,
    onPasswordSuccess?: () => void
}) {
    const [email, setEmail] = useState('')
    const [otpState, setOtpState] = useState('')
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
        onSuccess: () => {
            callbacks?.onEmailSuccess?.()
        },
        onError: (error: unknown) => {
            const apiError = error as ApiError;
            const emailError = apiError.response?.data?.email?.[0]
            if (emailError === "No account found with this email address.") {
                toast.error("Invalid email. Please confirm.")
            } else {
                toast.error(apiError.response?.data?.message || "Failed to send reset instructions")
            }
        }
    })




    const { mutate: resendMutate, isPending: resendPending } = useMutation({
        mutationFn: AuthService.passwordChangeResendOtp,
        
    })

    const { isPending: otpPending, mutate: otpMutate } = useMutation({
        mutationFn: AuthService.sendOtpForForgotPassword,
        onSuccess: () => {
            callbacks?.onOtpSuccess?.()
        },
        onError: (error: unknown) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.message || "Invalid OTP code")
        }
    })


    const { isPending: setNewPasswordPending, mutate: setNewPasswordMutate } = useMutation({
        mutationFn: AuthService.setNewPassword,
        onSuccess: () => {
            callbacks?.onPasswordSuccess?.()
        },
        onError: (error: unknown) => {
            const apiError = error as ApiError;
            toast.error(apiError.response?.data?.message || "Failed to update password")
        }
    })


    async function onEmailSubmit(value: EmailSchemaType) {
        mutate(value)
    }



    function submitOtpForPasswordChange(value: otpSchemaType) {
        const payload = {
            email,
            otp: value.otp
        }
        setOtpState(value.otp);
        otpMutate(payload)
    }



    function handleNewPasswordChange(value: setNewPasswordSchemaType) {
     
        const payload = {
            email,
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
        email,
        setEmail,
        resendPending,
        resendOtpFunction
    }
}

import { UserMgtService } from '@/services/UserMgt.service'
import { HandleVerificationStatusPayloadType } from '@/types/UserMgtType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'


// const approvalStatusSchema = z.object({
//     status: z.string(),
//     description: z.string().min(3, { message: 'Description must be at least 3 characters' }),
// })
const approvalStatusSchema = z.object({
  status: z.string(),
  description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.status === "Reject Verification") {
    if (!data.description || data.description.trim().length < 3) {
      ctx.addIssue({
        path: ["description"],
        message: "Description is required when rejecting verification",
        code: z.ZodIssueCode.custom,
      });
    }
  }
});

const defaultValues = {
  status: '',
  description: ''
}
type ValueType = z.infer<typeof approvalStatusSchema>;
export default function useApprovalStatus(user_id: string, onSuccessCallback: () => void) {
  const form = useForm({
    resolver: zodResolver(approvalStatusSchema),
    defaultValues

  })
  const { isPending, mutate } = useMutation({
    
    mutationFn: (payload: HandleVerificationStatusPayloadType) => UserMgtService.handleVerificationStatus(user_id, payload),
    onSuccess: () => {
      onSuccessCallback()
      toast.success('Status updated successfully')
      form.reset()
    }
  })


  function onSubmit(payload: ValueType) {

    if (payload.status.toLowerCase() === 'approve verification') {

      mutate({ is_approved: true })
    } else if (payload.status === 'reject verification') {

      mutate({
        is_rejected: true,
        rejection_reason: payload.description!
      })
    }
  }
  return { onSubmit, isPending, form }
}

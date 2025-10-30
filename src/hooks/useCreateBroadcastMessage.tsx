import { BroadcastMgtService } from '@/services/BroadcastMgt.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'





const createBroadcastSchema = z.object({
  subject: z.string().min(3, { message: "Subject must have minimum of 3 characters" }),
  message: z.string().min(3, { message: "Message must have minimum of 3 characters" }),
  mediums: z
    .array(z.enum(["email", "platform", "sms"])),
  target_roles: z
    .array(z.string())
    .nonempty({ message: "At least one target role is required" }),
})

type ValueType = z.infer<typeof createBroadcastSchema>

const defaultValues: ValueType = {
  subject: '',
  message: '',
  mediums: [],
  target_roles: []
}

export default function useCreateBroadcastMessage(onSuccessCallback: () => void) {
  const form = useForm({
    resolver: zodResolver(createBroadcastSchema),
    defaultValues
  })
  const { isPending, mutate } = useMutation({
    mutationFn: BroadcastMgtService.createBroadcastMessage,
    onSuccess: () => {
      toast.success('Broadcast created successfully')
      form.reset()
      onSuccessCallback()
    },
    onError: () => {
      toast.error('Failed to create broadcast')
    }
  })

  function onSubmit(payload: ValueType) {
    // mutate(payload)
    console.log(JSON.stringify(payload))
  }

  return { isPending, form, onSubmit }
}

import { UserMgtService } from '@/services/UserMgt.service'
import { InviteStaffMemberPayloadType } from '@/types/UserMgtType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'



const inviteStaffMemberSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  password2: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
  role: z.string().min(2, { message: 'Role must be at least 2 characters' }),
  occupation: z.string().min(2, { message: 'Occupation must be at least 2 characters' }),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ['password2'],
})

const defaultValues: InviteStaffMemberPayloadType = {
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  password: '',
  password2: '',
  role: '',
  occupation: ''
}

export type InviteStaffValueType = z.infer<typeof inviteStaffMemberSchema>;
export default function useInviteStaffMember() {
  const form = useForm<InviteStaffValueType>({
    resolver: zodResolver(inviteStaffMemberSchema),
    defaultValues
  })

  const { isPending, mutate } = useMutation({
    mutationFn: UserMgtService.inviteStaffMember,
    onSuccess: (value) => {
      console.log(value);
      toast.success(value.message || 'Staff member invited successfully')
      form.reset()
    },
    onError: () => {
      toast.error('Failed to create exam session. Please try again.')
    }
  })

  function onSubmit(data: InviteStaffValueType) {
    console.log(`submitted data:`, data);
    mutate(data)
  }



  return { form, onSubmit, isPending }
}

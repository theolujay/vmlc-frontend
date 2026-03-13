import { BroadcastMgtService } from '@/services/BroadcastMgt.service';
import { CreateBroadCastType } from '@/types/BroadCastType';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';

const staffRoles = [
  'volunteer',
  'moderator',
  'admin',
  'manager',
  'superadmin',
] as const;
const candidateRoles = ['screening', 'league', 'final', 'winner'] as const;

const createBroadcastSchema = z.object({
  subject: z
    .string()
    .min(3, { message: 'Subject must have minimum of 3 characters' }),
  message: z
    .string()
    .min(3, { message: 'Message must have minimum of 3 characters' }),
  mediums: z
    .array(z.enum(['email', 'platform', 'sms', 'whatsapp']))
    .min(1, { message: 'At least one medium is required' }),
  target_roles: z
    .object({
      staff: z.array(z.enum(staffRoles)).optional(),
      candidate: z.array(z.enum(candidateRoles)).optional(),
    })
    .refine(
      (data) =>
        (data.staff && data.staff.length > 0) ||
        (data.candidate && data.candidate.length > 0),
      { message: 'At least one target role is required (staff or candidate)' }
    ),
  scheduled_at: z.string().optional(),
});

type ValueType = z.infer<typeof createBroadcastSchema>;

const defaultValues: ValueType = {
  subject: '',
  message: '',
  mediums: [],
  target_roles: {
    staff: [],
    candidate: [],
  },
  scheduled_at: '',
};

export default function useCreateBroadcastMessage(
  onSuccessCallback: () => void
) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(createBroadcastSchema),
    defaultValues,
  });
  const { isPending, mutate } = useMutation({
    mutationFn: BroadcastMgtService.createBroadcastMessage,
    onSuccess: () => {
      toast.success('Broadcast created successfully');
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['broadcast-management'] });
      onSuccessCallback();
    },
    onError: () => {
      toast.error('Failed to create broadcast');
    },
  });

  function onSubmit(payload: ValueType) {
    // Clean up empty arrays from target_roles
    const cleanedPayload: CreateBroadCastType = {
      ...payload,
      target_roles: {},
      scheduled_at: payload.scheduled_at || undefined,
    };

    if (payload.target_roles.staff && payload.target_roles.staff.length > 0) {
      cleanedPayload.target_roles.staff = payload.target_roles.staff;
    }
    if (
      payload.target_roles.candidate &&
      payload.target_roles.candidate.length > 0
    ) {
      cleanedPayload.target_roles.candidate = payload.target_roles.candidate;
    }

    mutate(cleanedPayload);
  }

  return { isPending, form, onSubmit };
}

export { staffRoles, candidateRoles };

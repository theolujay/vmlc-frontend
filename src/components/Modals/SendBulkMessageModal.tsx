import AppDialog from '@/components/ui/Modals/AppDialog';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import useCreateBroadcastMessage, {
  candidateRoles,
  staffRoles,
} from '@/hooks/useCreateBroadcastMessage';
import clsx from 'clsx';
import { FormProvider, useController } from 'react-hook-form';
import { Checkbox } from '../ui/Checkbox';

const mediums = [
  { label: 'Platform', value: 'platform' as const },
  { label: 'Email', value: 'email' as const },
];

const staffRoleOptions = staffRoles.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1),
  value: role,
}));

const candidateRoleOptions = candidateRoles.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1),
  value: role,
}));

export default function SendBulkMessageModal({
  open,
  close,
}: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
  function handleClose() {
    close(false);
  }
  const { onSubmit, form, isPending } = useCreateBroadcastMessage(handleClose);

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { field: mediumsField } = useController({
    name: 'mediums',
    control,
  });

  const { field: staffRolesField } = useController({
    name: 'target_roles.staff',
    control,
  });

  const { field: candidateRolesField } = useController({
    name: 'target_roles.candidate',
    control,
  });

  const toggleMedium = (value: 'email' | 'platform') => {
    const currentValues = mediumsField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    mediumsField.onChange(newValues);
  };

  const toggleStaffRole = (value: (typeof staffRoles)[number]) => {
    const currentValues = staffRolesField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    staffRolesField.onChange(newValues);
  };

  const toggleCandidateRole = (value: (typeof candidateRoles)[number]) => {
    const currentValues = candidateRolesField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    candidateRolesField.onChange(newValues);
  };

  return (
    <AppDialog open={open} onOpenChange={close}>
      <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col gap-2 max-h-[90vh] overflow-hidden">
        <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
          <h2 className="text-2xl">Send bulk message</h2>
        </div>
        <div className="p-2 overflow-y-auto">
          <ResponsiveContainer className="rounded-md p-4">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col">
                  <label htmlFor="subject" className="mb-1">
                    TITLE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="border outline-0 p-2 border-[#D0D5DD] rounded-lg"
                    placeholder="Enter broadcast subject"
                  />
                  {errors.subject && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.subject.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="message" className="mb-1">
                    MESSAGE <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    className="border resize-none outline-0 p-2 border-[#D0D5DD] rounded-lg"
                    rows={4}
                    placeholder="Enter your message"
                  />
                  {errors.message && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.message.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="mb-1">
                    Select message medium{' '}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="flex gap-3 flex-wrap">
                    {mediums.map((medium) => {
                      const isChecked = mediumsField.value?.includes(
                        medium.value
                      );
                      return (
                        <div
                          key={medium.value}
                          className={clsx(
                            'option border rounded-lg py-2 px-3 items-center flex gap-2 cursor-pointer transition-colors',
                            {
                              'bg-[#F7F7FB] border-[#3E4095]': isChecked,
                              'border-[#D0D5DD]': !isChecked,
                            }
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleMedium(medium.value);
                          }}
                        >
                          <Checkbox id={medium.value} checked={isChecked} />
                          <span className="cursor-pointer">{medium.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {errors.mediums && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.mediums.message}
                    </span>
                  )}
                </div>

                {/* Staff Roles Section */}
                <div className="flex flex-col gap-2">
                  <span className="mb-1">Staff Roles</span>
                  <div className="flex gap-3 flex-wrap">
                    {staffRoleOptions.map((role) => {
                      const isChecked = staffRolesField.value?.includes(
                        role.value
                      );
                      return (
                        <div
                          key={role.value}
                          className={clsx(
                            'option border rounded-lg py-2 px-3 items-center flex gap-2 cursor-pointer transition-colors',
                            {
                              'bg-[#F7F7FB] border-[#3E4095]': isChecked,
                              'border-[#D0D5DD]': !isChecked,
                            }
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleStaffRole(role.value);
                          }}
                        >
                          <Checkbox
                            id={`staff-${role.value}`}
                            checked={isChecked}
                          />
                          <span className="cursor-pointer">{role.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Candidate Roles Section */}
                <div className="flex flex-col gap-2">
                  <span className="mb-1">Candidate Roles</span>
                  <div className="flex gap-3 flex-wrap">
                    {candidateRoleOptions.map((role) => {
                      const isChecked = candidateRolesField.value?.includes(
                        role.value
                      );
                      return (
                        <div
                          key={role.value}
                          className={clsx(
                            'option border rounded-lg py-2 px-3 items-center flex gap-2 cursor-pointer transition-colors',
                            {
                              'bg-[#F7F7FB] border-[#3E4095]': isChecked,
                              'border-[#D0D5DD]': !isChecked,
                            }
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCandidateRole(role.value);
                          }}
                        >
                          <Checkbox
                            id={`candidate-${role.value}`}
                            checked={isChecked}
                          />
                          <span className="cursor-pointer">{role.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {errors.target_roles && (
                  <span className="text-red-500 text-sm">
                    {errors.target_roles.message ||
                      errors.target_roles.root?.message}
                  </span>
                )}

                <div className="flex gap-2 mt-4 w-full">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg font-semibold cursor-pointer border border-[#E4E7EC] text-gray-700"
                    disabled={isPending}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={clsx(
                      'px-4 py-2 font-semibold rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]',
                      { 'opacity-50 cursor-not-allowed': isPending }
                    )}
                  >
                    {isPending ? 'SENDING...' : 'PROCEED TO SEND MESSAGE'}
                  </button>
                </div>
              </form>
            </FormProvider>
          </ResponsiveContainer>
        </div>
      </div>
    </AppDialog>
  );
}

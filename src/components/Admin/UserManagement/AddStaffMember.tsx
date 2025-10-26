"use client"
import AddStaffConfirmationModal from '@/components/Modals/AddStaffConfirmationModal'
import Button from '@/components/ui/Button'
import Input, { ConfirmPasswordInput, PasswordInput, PhoneNumberInput } from '@/components/ui/Input'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Spinner from '@/components/ui/spinner/spinner'
import { ChevronDownIcon, ChevronUpIcon, MailIcon, OccupationIcon, PasswordIcon, PersonIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import useInviteStaffMember, { InviteStaffValueType } from '@/hooks/useInviteStaffMember'
import { AddStaffMemberFormProps } from '@/types/UserMgtType'
import clsx from 'clsx'
import { useState } from 'react'
import { FormProvider, useFormContext } from 'react-hook-form'
import AdminHeader from '../AdminHeader'
import { SendIcon } from '../AdminIcons'

export default function AddStaffMember() {
  const [open, setOpen] = useState(false)

  const { form, onSubmit, isPending } = useInviteStaffMember()
  return (
    <div className='flex flex-col gap-1 '>
      <AdminHeader isExport={false} label='Add staff' actionButton={<Button disabled={isPending} invite="invite-staff-form" className={clsx("inline-flex gap-2 border min-w-10 px-2 items-center text-sm")}>{isPending ? <Spinner /> : <><span><SendIcon /></span><span>SEND INVITE</span></>}</Button>} />
      <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
        <AddStaffMemberForm form={form} onSubmit={onSubmit} />
      </div>

      <AddStaffConfirmationModal open={open} close={setOpen} />
    </div>
  )
}






function AddStaffMemberForm({ form, onSubmit }: Readonly<AddStaffMemberFormProps<InviteStaffValueType>>) {

  return <ResponsiveContainer className="flex w-full">
    <FormProvider {...form}>

      <form id="invite-staff-form" onSubmit={form.handleSubmit(onSubmit)} className='grid p-4 gap-5 grid-cols-1 md:grid-cols-2' action="">
        <div className="col-span-1 gap-2 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input name="first_name" label='STAFF FIRST NAME' placeholder='Input first name (e.g John)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
            <Input name='last_name' label='STAFF LAST NAME' placeholder='Input last name (e.g Doe)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
          </div>
          <div className="grid">
            <Input name='email' icon={<MailIcon />} label='STAFF EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <PhoneNumberInput name='phone' placeholder='+234 810 000 0000' className='border-[#D0D5DD]' label='STAFF PHONE NUMBER' />
          </div>
          <div className="grid">
            <Input name='occupation' icon={<OccupationIcon />} label='OCCUPATION' placeholder="Input your occupation (e.g Teacher)" className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <PasswordInput name='password' icon={<PasswordIcon />} label='PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
          </div>
          <div className="grid">
            <ConfirmPasswordInput name='password2' icon={<PasswordIcon />} label='CONFIRM PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
          </div>
        </div>
        <RolePermissionForm />
      </form>
    </FormProvider>
  </ResponsiveContainer>
}



type Permission = {
  name: string;
  label: string;
};

type Role = {
  name: string;
  label: string;
  permissions: Permission[];
};

const roles: Role[] = [
  // {
  //     name: "superAdmin",
  //     label: "Super Administrator",
  //     permissions: [
  //         { name: "overview", label: "Overview" },
  //         { name: "examSystem", label: "Exam System" },
  //         { name: "leaderboards", label: "Leaderboards" },
  //         { name: "userManagement", label: "User Management" },
  //         { name: "announcement", label: "Announcement" },
  //     ],
  // },
  {
    name: "assistantAdmin",
    label: "Administrator",
    permissions: [
      { name: "overview", label: "Overview" },
      { name: "examSystem", label: "Exam System" },
      { name: "leaderboards", label: "Leaderboards" },
      { name: "userManagement", label: "User Management" },
      { name: "announcement", label: "Announcement" },
    ],
  },
  {
    name: "moderator",
    label: "Moderator",
    permissions: [
      { name: "overview", label: "Overview" },
      { name: "examSystem", label: "Exam System" },
      { name: "leaderboards", label: "Leaderboards" },

    ],
  },
  {
    name: "Volunteer",
    label: "Volunteer",
    permissions: [
      { name: "overview", label: "Overview" },
    ],
  },
];




function RolePermissionForm() {
  const { setValue, watch } = useFormContext();
  const [openRole, setOpenRole] = useState<string | null>(null);
  const selectedRole = watch('role');

  const toggleRole = (roleName: string) => {
    setOpenRole(openRole === roleName ? null : roleName);
  };

  const handleRoleSelect = (roleName: string) => {
    if (selectedRole === roleName) {
      setValue('role', '');
      setOpenRole(null);
    } else {
      setValue('role', roleName);
      setOpenRole(roleName);
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500 mb-3 font-medium">
        Required <span className="text-red-500">*</span>
      </p>

      {roles.map((role) => {
        const isSelected = selectedRole === role.name;
        const isOpen = openRole === role.name;

        return (
          <div key={role.name} className="border-b border-gray-200 py-3">
            <div className="w-full flex justify-between items-center text-left">
              <label className="flex items-center gap-2 font-semibold text-gray-800">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleRoleSelect(role.name)}
                  className="w-4 h-4"
                />
                {role.label}
              </label>
              <button
                disabled={!isSelected}
                onClick={() => toggleRole(role.name)}
                type="button"
                className={clsx(
                  "flex items-center font-semibold gap-1",
                  isSelected
                    ? "text-[#3E4095]"
                    : "text-gray-300 cursor-not-allowed"
                )}
              >
                {isOpen ? (
                  <>
                    Close <ChevronUpIcon />
                  </>
                ) : (
                  <>
                    Open <ChevronDownIcon />
                  </>
                )}
              </button>
            </div>

            {isOpen && isSelected && (
              <div className="mt-3 bg-gray-50 rounded-lg p-4 space-y-2 animate-fadeIn">
                {role.permissions.map((perm) => (
                  <div
                    key={perm.name}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#3E4095] rounded-sm"></div>
                    </div>
                    {perm.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

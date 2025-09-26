import React, { useState } from 'react'
import AdminHeader from '../AdminHeader'
import Button from '@/components/ui/Button'
import { SendIcon } from '../AdminIcons'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import Input, { PasswordInput, PhoneNumberInput } from '@/components/ui/Input'
import { MailIcon, PasswordIcon, PersonIcon } from '@/components/ui/SvgAsset/GeneralAsset'
import AddStaffConfirmationModal from '@/components/Modals/AddStaffConfirmationModal'

export default function AddStaffMember() {
    const [open,setOpen]=useState(false)
    return (
        <div className='flex flex-col gap-1 '>
            <AdminHeader isExport={false} label='Add staff' actionButton={<Button className="inline-flex gap-2 border px-2 items-center text-sm"><span><SendIcon /></span><span>SEND INVITE</span></Button>} />
            <div className="flex flex-col gap-3 mt-3 w-[96%] mx-auto">
                <AddStaffMember/>
            </div>

            <AddStaffConfirmationModal open={open} close={setOpen} />
        </div>
    )
}



function AddStaffMemberForm() {
    return <ResponsiveContainer className="flex w-full">
        <form className='grid grid-cols-2' action="">
            <div className="col-span-1 flex flex-col">
                <div className="grid grid-cols-2 gap-2">
                    <Input label='STAFF FIRST NAME' placeholder='Input first name (e.g John)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
                    <Input label='STAFF LAST NAME' placeholder='Input last name (e.g Doe)' className='border-[#D0D5DD]' icon={<PersonIcon />} />
                </div>
                <div className="grid">
                    <Input icon={<MailIcon />} label='STAFF EMAIL' placeholder='Input your mail (e.g johndoe@gmail.com)' className='border-[#D0D5DD]' />
                </div>
                <div className="grid">
                    <PhoneNumberInput placeholder='+234 810 000 0000' className='border-[#D0D5DD]' label='STAFF PHONE NUMBER' />
                </div>
                <div className="grid">
                    <PasswordInput icon={<PasswordIcon />} label='PASSWORD' placeholder='Input your password' className='border-[#D0D5DD]' />
                </div>
            </div>
        </form>
    </ResponsiveContainer>
}
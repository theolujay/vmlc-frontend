"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import clsx from 'clsx'
import { ModalConfirmationIcon } from '../Admin/AdminIcons'
import Spinner from '../ui/spinner/spinner'

export default function InviteActionConfirmationModal({ open, close, userMail, form, role, isPending = false }: Readonly<{ open: boolean, userMail: string, form?: string, role: string, isPending: boolean, close: (close: boolean) => void }>) {

    function handleClose() {
        close(false)
    }
    return (
        <AppDialog open={open}>
            <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
                <span><ModalConfirmationIcon /></span>
                <h2 className='font-bold text-xl'>Action Confirmation</h2>
                <p className='inline-flex text-start '>Please confirm that you want to add {userMail} as {role.toLowerCase()} on the platform</p>
                <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg font-bold cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                        // onClick={handleClose}
                        form={form}
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer font-bold flex-1 text-white bg-[#3E4095]")}
                    >
                        {
                            isPending ? <Spinner /> :
                                'CONFIRM INVITE'
                        }
                    </button>
                </div>
            </div>
        </AppDialog>
    )
}

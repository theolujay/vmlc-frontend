import React from 'react'
// import AppDialog from '../ui/Modals/AppDialog'
import clsx from 'clsx'
// import { SubmissionIcon } from '../General/GeneralIcon'
import { ModalDeleteIcon } from '../AdminIcons'
import AppDialog from '@/components/ui/Modals/AppDialog'

export default function UploadConfirmationModal({ open, close }: { open: boolean, close: (close: boolean) => void }) {
     function handleClose() {
        close(!open)
    }
  return (
    <AppDialog open={open}>
        <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
            <span><ModalDeleteIcon/></span>
            <h2>{`You're`} about to upload the leaderboard results</h2>
            <p>Are you sure you want to upload the leaderboard results to all participants? Please confirm if you want to proceed.</p>
             <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button         
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]" )}
                    >
                    CONFIRM UPLOAD
                    </button>
                </div>
        </div>
    </AppDialog>
  )
}

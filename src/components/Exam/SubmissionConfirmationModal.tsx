import React from 'react'
import AppDialog from '../ui/Modals/AppDialog'
import clsx from 'clsx'
import { SubmissionIcon } from '../General/GeneralIcon'

export default function SubmissionConfirmationModal({ open, close }: { open: boolean, close: (close: boolean) => void }) {
     function handleClose() {
        close(!open)
    }
  return (
    <AppDialog open={open}>
        <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
            <span><SubmissionIcon/></span>
            <h2>Submission Confirmation</h2>
            <p>You have answered 30 of 30 questions. Do you wish to proceed to submit your exam responses?</p>

             <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                       
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-green-600" )}
                    >
                    PROCEED TO SUBMIT
                    </button>
                </div>
        </div>
    </AppDialog>
  )
}

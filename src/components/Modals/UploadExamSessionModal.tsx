import React from 'react'
import clsx from 'clsx'
import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'

export default function UploadExamSessionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
      function handleClose() {
        close(!open)
    }
  return (
    <AppDialog open={open}>
        <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
            <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                <h2 className='text-2xl'>Upload Exam Session</h2>
            </div>
            <div className="p-2">

            <ResponsiveContainer className='rounded-md p-4'>
                <form action="" className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>EXAM DATE <span className="text-red-500">*</span></label>
                        <input required type='date' className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>EXAM TIME <span className="text-red-500">*</span></label>
                        <input required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                    </div>
                     <div className="flex justify-between">
                        <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>PERIOD VALUE <span className="text-red-500">*</span></label>
                        <input required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                    </div>
                     <div className="flex flex-col">
                        <label htmlFor="exam" className='mb-1'>PERIOD TYPE<span className="text-red-500">*</span></label>
                        <input required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                    </div>
                     </div>
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
                                      UPLOAD EXAM SESSION
                                        </button>
                                    </div>
                </form>
            </ResponsiveContainer>
            </div>
        </div>
    </AppDialog>
  )
}

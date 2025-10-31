import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useCreateBroadcastMessage from '@/hooks/useCreateBroadcastMessage'
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form'
import { Checkbox } from '../ui/Checkbox'
import useBulkAddQuestionsToSession from '@/hooks/useBulkAddQuestionsToSession'


export default function AddToExamSessionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(false)
    }
    const {  onSubmit, form } = useCreateBroadcastMessage(handleClose)

    // const { register } = form
    // const {onSubmit}=useBulkAddQuestionsToSession()
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
                <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className='text-2xl'>Send bulk message</h2>
                </div>
                <div className="p-2">
                    <ResponsiveContainer className='rounded-md p-4'>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="exam" className='mb-1'>EXAM SESSION</label>
                                    <select className='rounded-md border-[#D0D5DD] outline-none p-3 border ' name=""  id="">
                                        <option value="">Select exam session</option>
                                    </select>
                                   
                                </div>
                               
                                
                                <div className="flex gap-2 mt-4 w-full">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 rounded-lg font-semibold cursor-pointer border border-[#E4E7EC] text-gray-700"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        className={clsx("px-4 py-2 font-semibold rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
                                    >
                                        PROCEED TO ADD
                                    </button>
                                </div>
                            </form>
                        </FormProvider>
                    </ResponsiveContainer>
                </div>
            </div>
        </AppDialog>
    )
}

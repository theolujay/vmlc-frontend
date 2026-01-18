import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useEditExamSession from '@/hooks/useEditExamSession'
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form'
import Spinner from '../ui/spinner/spinner'

export default function EditSessionModal({ open, close, exam_id }: Readonly<{ open: boolean, close: (close: boolean) => void, exam_id: string }>) {
    function handleClose() {
        close(!open)
    }
    const { form, onSubmit, isPending } = useEditExamSession(exam_id, handleClose)
    const { register } = form
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
                <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className='text-2xl'>Edit Session</h2>
                </div>
                <div className="p-2">

                    <ResponsiveContainer className='rounded-md p-4'>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    {/* <NeutralInput name='title' label='EXAM SESSION TITLE '/> */}
                                    <label htmlFor="exam" className='mb-1'>EXAM SESSION TITLE <span className="text-red-500">*</span></label>
                                    <input {...register('title')} placeholder='Title' required type="text" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="exam" className='mb-1'>DESCRIPTION <span className="text-red-500">*</span></label>
                                    <textarea  {...register('description')} placeholder='Description' required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' id="" />
                                </div>
                                <div className="flex gap-2 mt-4 w-full">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 font-semibold rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        disabled={isPending}
                                        type='submit'
                                        className={clsx("px-4 py-2 font-semibold rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
                                    >
                                        {isPending ? <Spinner /> : 'SAVE'}

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

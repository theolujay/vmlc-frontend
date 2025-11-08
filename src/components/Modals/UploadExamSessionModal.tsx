import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useUploadSession from '@/hooks/useUploadSession';
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form';

export default function UploadExamSessionModal({ open, close, exam_id }: Readonly<{ open: boolean, close: (close: boolean) => void, exam_id: number }>) {
    function handleClose() {
        close(!open)
    }

    const { onSubmit, isPending, form } = useUploadSession(exam_id);
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
                <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className='text-2xl'>Upload Exam Session</h2>
                </div>
                <div className="p-2 max-h-[70vh] overflow-y-auto">

                    <ResponsiveContainer className='rounded-md p-4'>
                        <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            {/* <div className="flex flex-col">
                                <label htmlFor="exam" className='mb-1'>LEVEL <span className="text-red-500">*</span></label>
                                <input required type='date' className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' placeholder='League 1' />
                            </div> */}
                            <div className="flex flex-col">
                                <label htmlFor="exam" className='mb-1'>EXAM DATE <span className="text-red-500">*</span></label>
                                <input {...form.register('scheduled_date')} required type='date' className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                            </div>

                            {form.formState.errors.scheduled_date && (
    <p className="text-sm text-red-500 mt-1">
      {form.formState.errors.scheduled_date.message as string}
    </p>
  )}
                            <div className="flex flex-col">
                                <label htmlFor="exam" className='mb-1'>START EXAM TIME <span className="text-red-500">*</span></label>
                                <input {...form.register('start_time')} required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                            </div>
                            {form.formState.errors.start_time && (
    <p className="text-sm text-red-500 mt-1">
      {form.formState.errors.start_time.message as string}
    </p>
  )}
                            <div className="flex flex-col">
                                <label htmlFor="exam" className='mb-1'>END EXAM TIME <span className="text-red-500">*</span></label>
                                <input {...form.register('end_time')} required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                            </div>
                            <div className="flex gap-2 justify-between">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="exam" className='mb-1'>COUNTDOWN <span className="text-red-500">*</span></label>
                                    <input {...form.register('countdown_minutes')} required type="number" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                </div>
                                {form.formState.errors.countdown_minutes && (
    <p className="text-sm text-red-500 mt-1">
      {form.formState.errors.countdown_minutes.message as string}
    </p>
  )}
                                {/* <div className="flex  flex-col flex-1">
                                    <label htmlFor="exam" className='mb-1'>COUNTDOWN TYPE<span className="text-red-500">*</span></label>
                                    <input required type="time" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                    <UploadSelectInput placeholder='Select a value' items={['Minutes','Hours']} />
                                </div> */}
                            </div>

                            




                            <div className="flex gap-2 mt-4 w-full">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                                >
                                    CANCEL
                                </button>
                                <button
                                type='submit'
                                    className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
                                >
                                    UPLOAD EXAM SESSION
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

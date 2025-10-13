import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useCreateExamSession from '@/hooks/useCreateExamSession'
import clsx from 'clsx'
import { Controller, FormProvider } from 'react-hook-form'
import SelectInput from '../ui/Select'

export default function CreateExamSessionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(!open)
    }
    const { isPending, onSubmit, form } = useCreateExamSession()
    const { register, handleSubmit, formState: { errors } } = form
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
                <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className='text-2xl'>Create an Exam Session</h2>
                </div>
                <div className="p-2">
                    <ResponsiveContainer className='rounded-md p-4'>
                        <FormProvider {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="flex justify-between gap-2">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="exam" className='mb-1'>EXAM SESSION TITLE <span className="text-red-500">*</span></label>
                                        <input required placeholder='Enter title of exam session (E.g., Screening Exam)' type="text" {...register('title')} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                         {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                                    </div>
{/* 
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="exam" className='mb-1'>STAGE<span className="text-red-500">*</span></label>
                                        <Controller control={form.control} name='stage' render={({ field }) => (
                                            <SelectInput value={field.value} onValueChange={field.onChange} items={['screening', 'league', 'final', 'winner']} />
                                        )} />
                                         {errors.stage && <p className="text-red-500 text-sm">{errors.stage.message}</p>}

                                       
                                    </div> */}
                                </div>
                                  <div className="flex flex-col flex-1">
                                        <label htmlFor="exam" className='mb-1'>STAGE<span className="text-red-500">*</span></label>
                                        <Controller control={form.control} name='stage' render={({ field }) => (
                                            <SelectInput value={field.value} onValueChange={field.onChange} items={['screening', 'league']} />
                                        )} />
                                         {errors.stage && <p className="text-red-500 text-sm">{errors.stage.message}</p>}

                                        {/* <input required type="text" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' /> */}
                                    </div>
                                <div className="flex flex-col">
                                    <label htmlFor="exam" className='mb-1'>DESCRIPTION <span className="text-red-500">*</span></label>
                                    <textarea placeholder='Enter a description...' {...register("description")} required className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' name="" id="" />
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                                </div>
                                <div className="flex gap-2 mt-4 w-full">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
                                    >
                                        CREATE EXAM SESSION
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




"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useCreateExamSession from '@/hooks/useCreateExamSession'
import clsx from 'clsx'
import { Controller, FormProvider } from 'react-hook-form'
import SelectInput from '../ui/Select'
import Spinner from '../ui/spinner/spinner'
import { useEffect } from 'react'

export default function CreateExamSessionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(!open)
    }
    const { onSubmit, form, isPending, isSuccess } = useCreateExamSession()
    const { register, handleSubmit, formState: { errors } } = form


    useEffect(() => {
        let timeoutId: NodeJS.Timeout
        if (isSuccess) {
            timeoutId = setTimeout(() => {
                handleClose()
            }, 500)
        }
        return () => clearTimeout(timeoutId)
    }, [isSuccess])
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="stage_id" className='mb-1 text-sm'>STAGE ID</label>
                                        <input type="number" {...register('stage_id', { valueAsNumber: true })} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                        {errors.stage_id && <p className="text-red-500 text-sm">{errors.stage_id.message}</p>}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="round" className='mb-1 text-sm'>ROUND</label>
                                        <input type="number" {...register('round', { valueAsNumber: true })} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                        {errors.round && <p className="text-red-500 text-sm">{errors.round.message}</p>}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col">
                                    <label htmlFor="scheduled_date" className='mb-1 text-sm'>SCHEDULED DATE & TIME</label>
                                    <input type="datetime-local" {...register('scheduled_date')} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                    {errors.scheduled_date && <p className="text-red-500 text-sm">{errors.scheduled_date.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="open_duration_hours" className='mb-1 text-sm'>OPEN DURATION (HOURS)</label>
                                        <input type="number" {...register('open_duration_hours', { valueAsNumber: true })} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                        {errors.open_duration_hours && <p className="text-red-500 text-sm">{errors.open_duration_hours.message}</p>}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="countdown_minutes" className='mb-1 text-sm'>COUNTDOWN (MINUTES)</label>
                                        <input type="number" {...register('countdown_minutes', { valueAsNumber: true })} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                        {errors.countdown_minutes && <p className="text-red-500 text-sm">{errors.countdown_minutes.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="description" className='mb-1 text-sm'>DESCRIPTION <span className="text-red-500">*</span></label>
                                    <textarea placeholder='Enter a description...' {...register('description')} className='border outline-0 p-2 h-24 resize-none border-[#D0D5DD] rounded-lg' id="description" />
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
                                        type='submit'
                                        className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}>
                                        {isPending ? <Spinner /> :
                                            'CREATE EXAM SESSION'
                                        }
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




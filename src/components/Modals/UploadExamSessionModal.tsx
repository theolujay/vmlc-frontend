'use client';

import AppDialog from '@/components/ui/Modals/AppDialog'
import useUploadSession from '@/hooks/useUploadSession';
import { formatExamTitle } from '@/utils/generalUtils';
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form';
import Spinner from '../ui/spinner/spinner';

export default function UploadExamSessionModal({ open, close, exam_id, title }: Readonly<{ open: boolean, close: (close: boolean) => void, exam_id: string, title?: string }>) {
    function handleClose() {
        close(!open)
    }

    const { onSubmit, isPending, form } = useUploadSession(exam_id, handleClose);
    return (
        <AppDialog open={open}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
                <div className="header bg-white p-8 border-b border-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
                            <i className="fas fa-cloud-upload-alt text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>{formatExamTitle(title)}</p>
                            <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Publish Exam Session</h2>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Set the parameters to make this exam available to candidates.</p>
                </div>
                
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                        <i className="fas fa-calendar-day text-[#3E4095]"></i>
                                        Scheduled Date <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        {...form.register('scheduled_date')} 
                                        required 
                                        type='date' 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all' 
                                    />
                                    {form.formState.errors.scheduled_date && (
                                        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">
                                            {form.formState.errors.scheduled_date.message as string}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                        <i className="fas fa-clock text-[#3E4095]"></i>
                                        Start Time <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        {...form.register('scheduled_exam_time')} 
                                        required 
                                        type="time" 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all' 
                                    />
                                    {form.formState.errors.scheduled_exam_time && (
                                        <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">
                                            {form.formState.errors.scheduled_exam_time.message as string}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                    <i className="fas fa-door-open text-[#3E4095]"></i>
                                    Open Duration <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        {...form.register('open_duration_hours')} 
                                        required 
                                        type="number" 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all no-spinner' 
                                        placeholder="e.g. 24"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-widest pointer-events-none">HRS</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                    <i className="fas fa-stopwatch text-[#3E4095]"></i>
                                    Countdown Timer <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        {...form.register('countdown_minutes')} 
                                        required 
                                        type="number" 
                                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all no-spinner' 
                                        placeholder="e.g. 60"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-widest pointer-events-none">MINS</div>
                                </div>
                                {form.formState.errors.countdown_minutes && (
                                    <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">
                                        {form.formState.errors.countdown_minutes.message as string}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4 mt-4 w-full">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    disabled={isPending}
                                    className={clsx(
                                        "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                        isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                    )}
                                >
                                    {isPending ? <Spinner /> : (
                                        <>
                                            <span>Publish Session</span>
                                            <i className="fas fa-arrow-right text-[8px]"></i>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </FormProvider>
                </div>
            </div>
        </AppDialog>
    )
}

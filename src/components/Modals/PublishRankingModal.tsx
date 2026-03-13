"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import usePublishRanking from '@/hooks/usePublishRanking'
import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import Spinner from '../ui/spinner/spinner'
import { useEffect, useCallback, useState } from 'react'

interface PublishRankingFormValues {
    publish_now: boolean;
    publish_at?: string;
}

interface PublishRankingModalProps {
    open: boolean;
    close: (open: boolean) => void;
    examId: string;
    examTitle: string;
}

export default function PublishRankingModal({ open, close, examId, examTitle }: PublishRankingModalProps) {
    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { publishRanking, isPending } = usePublishRanking()
    const [mode, setMode] = useState<'immediate' | 'scheduled'>('immediate');

    const form = useForm<PublishRankingFormValues>({
        defaultValues: {
            publish_now: true,
            publish_at: undefined
        }
    })

    const { register, handleSubmit, setValue, formState: { errors, isSubmitSuccessful } } = form

    const onSubmit = (values: PublishRankingFormValues) => {
        publishRanking({
            exam_id: examId,
            publish_now: mode === 'immediate',
            publish_at: mode === 'scheduled' ? values.publish_at : null
        })
    }

    useEffect(() => {
        if (isSubmitSuccessful && !isPending) {
            const timeoutId = setTimeout(() => {
                handleClose()
            }, 500)
            return () => clearTimeout(timeoutId)
        }
    }, [isSubmitSuccessful, isPending, handleClose])

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
                <div className="header bg-white p-8 border-b border-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <i className="fas fa-upload text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>Exam Results Management</p>
                            <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Publish Ranking</h2>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Release the ranking snapshot for <span className="text-[#3E4095] font-bold">&quot;{examTitle}&quot;</span> to candidates.</p>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        <div className="flex flex-col gap-3">
                            <label className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                <i className="fas fa-bullhorn text-[#3E4095]"></i>
                                Publication Mode
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('immediate');
                                        setValue('publish_now', true);
                                    }}
                                    className={clsx(
                                        "flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all",
                                        mode === 'immediate'
                                            ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-500/5"
                                            : "bg-white border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <span className={clsx("text-[10px] font-black uppercase tracking-widest", mode === 'immediate' ? "text-emerald-700" : "text-gray-400")}>Immediate</span>
                                    <span className={clsx("text-[9px] font-medium leading-tight", mode === 'immediate' ? "text-emerald-600/80" : "text-gray-400")}>Release the ranking to candidates right now.</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('scheduled');
                                        setValue('publish_now', false);
                                    }}
                                    className={clsx(
                                        "flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all",
                                        mode === 'scheduled'
                                            ? "bg-blue-50 border-[#3E4095] ring-4 ring-[#3E4095]/5"
                                            : "bg-white border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <span className={clsx("text-[10px] font-black uppercase tracking-widest", mode === 'scheduled' ? "text-[#3E4095]" : "text-gray-400")}>Scheduled</span>
                                    <span className={clsx("text-[9px] font-medium leading-tight", mode === 'scheduled' ? "text-[#3E4095]/70" : "text-gray-400")}>Pick a future date and time for publication.</span>
                                </button>
                            </div>
                        </div>

                        {mode === 'scheduled' && (
                            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label htmlFor="publish_at" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                    <i className="fas fa-calendar-alt text-[#3E4095]"></i>
                                    Publication Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('publish_at', {
                                        required: mode === 'scheduled' ? "Publication time is required for scheduling" : false,
                                        validate: (value) => {
                                            if (mode === 'scheduled' && value) {
                                                const selectedDate = new Date(value);
                                                const now = new Date();
                                                return selectedDate > now || "Publication time must be in the future";
                                            }
                                            return true;
                                        }
                                    })}
                                    className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all'
                                    id="publish_at"
                                />
                                {errors.publish_at && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.publish_at.message}</p>}
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                            <i className="fas fa-info-circle text-[#3E4095] mt-0.5"></i>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[11px] font-bold text-[#3E4095] uppercase tracking-tight">Important Notice</p>
                                <p className="text-[10px] font-medium text-[#3E4095]/70 leading-tight">
                                    Publishing a ranking will make it visible to all candidates. For League stages, this will also update the global leaderboard.
                                </p>
                            </div>
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
                                    "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-emerald-600 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                    mode === 'scheduled' && "bg-[#3E4095] shadow-[#3E4095]/20",
                                    isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                )}
                            >
                                {isPending ? <Spinner /> : (
                                    <>
                                        <span>{mode === 'immediate' ? 'Publish Now' : 'Schedule Publication'}</span>
                                        <i className={clsx("fas text-[8px]", mode === 'immediate' ? "fa-upload" : "fa-calendar-check")}></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppDialog>
    )
}

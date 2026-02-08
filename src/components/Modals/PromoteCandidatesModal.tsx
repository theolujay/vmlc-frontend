"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import usePromoteCandidates, { PromoteCandidatesPayload } from '@/hooks/usePromoteCandidates'
import useGetStatOverview from '@/hooks/useGetStatOverview'
import useGetCompetitionDashboard from '@/hooks/useGetCompetitionDashboard'
import clsx from 'clsx'
import { Controller, useForm } from 'react-hook-form'
import SelectInput from '../ui/Select'
import Spinner from '../ui/spinner/spinner'
import { useEffect, useMemo, useCallback } from 'react'
import { toast } from 'react-toastify'

interface PromoteFormValues {
    from_stage: string;
    to_stage: string;
    cutoff_rank?: number;
}

export default function PromoteCandidatesModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { promoteCandidates, isPending } = usePromoteCandidates()
    const { data: dashboardData } = useGetCompetitionDashboard()
    
    const form = useForm<PromoteFormValues>({
        defaultValues: {
            from_stage: '',
            to_stage: '',
            cutoff_rank: undefined
        }
    })

    const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitSuccessful } } = form

    const selectedFromStage = watch('from_stage')

    const { data: statOverview } = useGetStatOverview()

    const fromStageOptions = ['Screening', 'League']
    
    const toStageOptions = useMemo(() => {
        if (selectedFromStage === 'Screening') return ['League']
        if (selectedFromStage === 'League') return ['Final']
        return []
    }, [selectedFromStage])

    useEffect(() => {
        if (selectedFromStage === 'Screening') {
            setValue('to_stage', 'League')
        } else if (selectedFromStage === 'League') {
            setValue('to_stage', 'Final')
        } else {
            setValue('to_stage', '')
        }
    }, [selectedFromStage, setValue])

    const isStageValid = useMemo(() => {
        if (!selectedFromStage || !dashboardData) return true;
        
        // A stage has "happened" if there is at least one concluded exam with published rankings
        const stageExams = dashboardData.exams.filter(
            e => e.stage.toLowerCase() === selectedFromStage.toLowerCase()
        );
        
        return stageExams.some(e => e.status === 'concluded' && e.ranking_status === 'published');
    }, [selectedFromStage, dashboardData]);

    const onSubmit = (values: PromoteFormValues) => {
        if (!isStageValid) {
            toast.error(`Cannot promote from ${values.from_stage} because rankings haven't been published for any exams in this stage yet.`);
            return;
        }
        
        // Construct payload, ensuring stages are lowercase
        const payload: PromoteCandidatesPayload = {
            from_stage: values.from_stage.toLowerCase(),
            to_stage: values.to_stage.toLowerCase()
        };

        // Only include cutoff_rank if it is a valid number
        if (values.cutoff_rank !== undefined && values.cutoff_rank !== null && !isNaN(values.cutoff_rank)) {
            payload.cutoff_rank = values.cutoff_rank;
        }

        promoteCandidates(payload)
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
                        <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
                            <i className="fas fa-users-cog text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>{statOverview?.competition?.active_competition || 'Competition Management'}</p>
                            <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Promote Candidates</h2>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Advance top performing candidates to the next competition stage.</p>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="from_stage" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                    <i className="fas fa-sign-out-alt text-[#3E4095]"></i>
                                    From Stage
                                </label>
                                <Controller
                                    control={control}
                                    name="from_stage"
                                    rules={{ required: "Source stage is required" }}
                                    render={({ field }) => (
                                        <SelectInput
                                            items={fromStageOptions}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Source"
                                        />
                                    )}
                                />
                                {errors.from_stage && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.from_stage.message}</p>}
                                {!isStageValid && selectedFromStage && (
                                    <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-tight">
                                        No published rankings for this stage.
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="to_stage" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                    <i className="fas fa-sign-in-alt text-[#3E4095]"></i>
                                    To Stage
                                </label>
                                <Controller
                                    control={control}
                                    name="to_stage"
                                    rules={{ required: "Target stage is required" }}
                                    render={({ field }) => (
                                        <SelectInput
                                            items={toStageOptions}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Target"
                                            disabled={toStageOptions.length <= 1 && !!selectedFromStage}
                                        />
                                    )}
                                />
                                {errors.to_stage && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.to_stage.message}</p>}
                            </div>
                        </div>

                        {!isStageValid && selectedFromStage && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start">
                                <i className="fas fa-exclamation-triangle text-amber-600 mt-0.5"></i>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">Stage Not Concluded</p>
                                    <p className="text-[10px] font-medium text-amber-700 leading-tight">
                                        Promotion can only happen after at least one exam in the source stage has concluded and its rankings have been published.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="cutoff_rank" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                <i className="fas fa-trophy text-[#3E4095]"></i>
                                Cutoff Rank (Optional)
                            </label>
                            <input 
                                type="number"
                                placeholder='e.g. 100 (Top 100)' 
                                {...register('cutoff_rank', { valueAsNumber: true })} 
                                className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] outline-none transition-all' 
                                id="cutoff_rank" 
                            />
                            <p className="text-[9px] text-gray-400 font-medium italic mt-1">If omitted, the default advancement policy will be used.</p>
                            {errors.cutoff_rank && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.cutoff_rank.message}</p>}
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
                                disabled={isPending || (!isStageValid && !!selectedFromStage)}
                                className={clsx(
                                    "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                    (isPending || (!isStageValid && !!selectedFromStage)) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                )}
                            >
                                {isPending ? <Spinner /> : (
                                    <>
                                        <span>Promote Candidates</span>
                                        <i className="fas fa-arrow-right text-[8px]"></i>
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

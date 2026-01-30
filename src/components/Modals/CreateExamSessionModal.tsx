"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useCreateExamSession from '@/hooks/useCreateExamSession'
import useGetStatOverview from '@/hooks/useGetStatOverview'
import clsx from 'clsx'
import { Controller, FormProvider } from 'react-hook-form'
import SelectInput from '../ui/Select'
import Spinner from '../ui/spinner/spinner'
import { useEffect, useMemo } from 'react'

export default function CreateExamSessionModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(!open)
    }
    const { onSubmit, form, isPending, isSuccess } = useCreateExamSession()
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = form

    const { data: statOverview } = useGetStatOverview()

    const stages = useMemo(() => statOverview?.competition?.stages || [], [statOverview])
    const selectedStageId = watch('stage_id')
    const selectedStage = useMemo(() => stages.find(s => s.id === selectedStageId), [stages, selectedStageId])
    const isLeague = selectedStage?.type === 'league'

    const roundOptions = useMemo(() => {
        if (!isLeague || !selectedStage) return []
        const unavailableRounds = selectedStage.rounds || []
        const maxUnavailable = unavailableRounds.length > 0 ? Math.max(...unavailableRounds) : 0
        const startRound = maxUnavailable + 1
        
        if (startRound > 6) return []
        
        return Array.from({ length: 6 - startRound + 1 }, (_, i) => (startRound + i).toString())
    }, [isLeague, selectedStage])

    useEffect(() => {
        if (!isLeague) {
            setValue('round', undefined)
        } else if (roundOptions.length > 0 && !watch('round')) {
            // Default to the first available round
            setValue('round', parseInt(roundOptions[0]))
        }
    }, [isLeague, roundOptions, setValue, watch])


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
                                        <label htmlFor="stage_id" className='mb-1 text-sm uppercase'>Stage</label>
                                        <Controller
                                            control={control}
                                            name="stage_id"
                                            render={({ field }) => (
                                                <SelectInput
                                                    items={stages.map(s => s.name)}
                                                    value={stages.find(s => s.id === field.value)?.name}
                                                    onValueChange={(name) => {
                                                        const s = stages.find(x => x.name === name)
                                                        field.onChange(s?.id)
                                                    }}
                                                    placeholder="Select Stage"
                                                />
                                            )}
                                        />
                                        {errors.stage_id && <p className="text-red-500 text-sm">{errors.stage_id.message}</p>}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label htmlFor="round" className={clsx('mb-1 text-sm uppercase', !isLeague && 'text-gray-400')}>Round</label>
                                        <Controller
                                            control={control}
                                            name="round"
                                            render={({ field }) => (
                                                <SelectInput
                                                    items={roundOptions}
                                                    value={field.value?.toString()}
                                                    onValueChange={(val) => field.onChange(parseInt(val))}
                                                    placeholder={isLeague ? "Select Round" : "N/A"}
                                                />
                                            )}
                                        />
                                        {errors.round && <p className="text-red-500 text-sm">{errors.round.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="description" className='mb-1 text-sm'>DESCRIPTION</label>
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






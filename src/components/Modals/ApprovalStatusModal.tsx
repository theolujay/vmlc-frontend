"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import clsx from 'clsx'
import { Controller, FormProvider } from 'react-hook-form'
import SelectInput from '../ui/Select'
import Spinner from '../ui/spinner/spinner'
import useApprovalStatus from '@/hooks/useApprovalStatus'

export default function ApprovalStatusModal({ open, close, user_id }: Readonly<{ user_id: string, open: boolean, close: (close: boolean) => void, }>) {
    function handleClose() {
        close(false)
    }
    const { form, onSubmit, isPending } = useApprovalStatus(user_id, handleClose)
    const { register } = form

    const watchStatus = form.watch("status");

    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col  gap-2 ">
                <div className="header flex flex-col rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className='text-2xl'>Approval Status</h2>
                    <span className='text-xs'>Please proceed to select the appropriate verification action</span>
                </div>
                <div className="p-2">

                    <ResponsiveContainer className='rounded-md p-4'>
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="flex flex-col">

                                    <label htmlFor="exam" className='mb-1'>VERIFICATION STATUS</label>
                                    <Controller rules={{ required: "Please select a verification status" }} control={form.control} name='status' render={({ field }) => (
                                        <SelectInput value={field.value} onValueChange={field.onChange} items={['Approve Verification', 'Reject Verification']} />
                                    )} />
                                    {/* <SelectInput placeholder='Select an option' items={['Approve Verification','Reject Verification']} /> */}
                                    {/* <input {...register('title')} placeholder='Title' required type="text" className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' /> */}
                                </div>


                                {
                                    watchStatus === 'Reject Verification' && (
                                        <div className="flex flex-col">
                                            <label htmlFor="exam" className='mb-1'>REASON FOR REJECTING VERIFICATION <span className="text-red-500">*</span></label>
                                            <textarea  {...register('description')} placeholder='Description' className='border outline-0 p-2 resize-none border-[#D0D5DD] rounded-lg' id="" />
                                        </div>

                                    )
                                }
                                <div className="flex gap-2 mt-4 w-full">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 font-semibold rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        disabled={isPending || !watchStatus}
                                        type='submit'
                                        className={clsx("px-4 py-2 font-semibold rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
                                    >
                                        {isPending ? <Spinner /> : 'PROCEED WITH ACTION'}

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

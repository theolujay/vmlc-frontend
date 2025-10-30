import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useCreateBroadcastMessage from '@/hooks/useCreateBroadcastMessage'
import clsx from 'clsx'
import { FormProvider } from 'react-hook-form'

const channel = ['Platform', 'Email', 'SMS']
export default function SendBulkMessageModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(false)
    }
    const {  onSubmit, form } = useCreateBroadcastMessage(handleClose)

    const { register } = form
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
                                    <label htmlFor="exam" className='mb-1'>TITLE</label>
                                    <input type='text' {...register('subject')} className='border outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="exam" className='mb-1'>MESSAGE <span className="text-red-500">*</span></label>
                                    <textarea {...register('message')} required className='border resize-none outline-0 p-2 border-[#D0D5DD] rounded-lg' />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className='mb-1'>Select message medium <span className="text-red-500">*</span></span>
                                    <div className="flex gap-3">
                                        {channel.map((val, index) => <div key={`option-${index + 1}`} className="option border border-[#D0D5DD] rounded-lg py-2 px-3 has-checked:bg-[#F7F7FB] has-checked:border-[#3E4095] flex gap-1 ">
                                            <label htmlFor={val}>{val}</label>
                                            <input value={val.toLowerCase()}
                                                {...register('mediums')} className='checked:accent-[#3E4095] rounded-full w-4  checked:border-[#3E4095]' id={val} type="checkbox" />
                                        </div>)}
                                    </div>
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
                                        PROCEED TO SEND MESSAGE
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

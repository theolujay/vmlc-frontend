"use client"
import AppDialog from '@/components/ui/Modals/AppDialog';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function VerificationSuccessfulDialog({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    const router = useRouter()

    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const navigateToDashboard = useCallback(() => {
        router.push('/exam-portal')
        handleClose()
    }, [router, handleClose])

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
                <div className="header bg-white p-8 border-b border-gray-50 text-center">
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                            <i className="fas fa-check-circle text-3xl"></i>
                        </div>
                        <p className='text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1'>Process Complete</p>
                        <h2 className='text-2xl font-bold text-gray-800 tracking-tight uppercase'>Verification Successful</h2>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-[80%] mx-auto">
                        Your verification has been successfully uploaded! While you wait for the {`admin's`} approval, feel free to visit your dashboard.
                    </p>
                </div>

                <div className="p-8">
                    <div className="flex gap-4 w-full">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={navigateToDashboard}
                            className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>Go To Dashboard</span>
                            <i className="fas fa-arrow-right text-[8px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </AppDialog>
    )
}

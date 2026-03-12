"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import useLogout from '@/hooks/useLogout'
import { useCallback } from 'react'

export default function LogOutModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { onLogout } = useLogout(handleClose)

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
                <div className="header bg-white p-8 border-b border-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <i className="fas fa-sign-out-alt text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>Account Action</p>
                            <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Logout</h2>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Are you sure you want to log out of your account?</p>
                </div>

                <div className="p-8">
                    <p className='text-sm text-gray-600 font-medium leading-relaxed'>
                        If you proceed, you will be signed out and redirected to the login page.
                    </p>

                    <div className="flex gap-4 mt-8 w-full">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            onClick={onLogout}
                            className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-red-600 shadow-lg shadow-red-600/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Logout</span>
                            <i className="fas fa-sign-out-alt text-[8px]"></i>
                        </button>
                    </div>
                </div>
            </div>
        </AppDialog>
    )
}

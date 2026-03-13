"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import { useCallback } from 'react'

interface SnoozeModalProps {
    open: boolean;
    close: (open: boolean) => void;
    onSnooze: (minutes: number) => void;
    loading?: boolean;
}

export default function SnoozeModal({ open, close, onSnooze, loading }: Readonly<SnoozeModalProps>) {
    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const options = [
        { label: '1 Minute', value: 1 },
        { label: '5 Minutes', value: 5 },
        { label: '15 Minutes', value: 15 },
    ];

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-sm w-full mx-auto font-sans">
                <div className="header bg-white p-6 border-b border-gray-50">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <i className="fas fa-clock text-lg"></i>
                        </div>
                        <div>
                            <p className='text-[8px] text-gray-400 font-black uppercase tracking-widest'>Thread Action</p>
                            <h2 className='text-lg font-bold text-gray-800 tracking-tight uppercase'>Snooze Thread</h2>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">Choose how long you want to snooze this thread.</p>
                </div>

                <div className="p-6">
                    <div className="flex flex-col gap-3">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                disabled={loading}
                                onClick={() => onSnooze(option.value)}
                                className="w-full px-4 py-3 rounded-xl font-bold text-xs tracking-wide border border-gray-200 text-gray-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{option.label}</span>
                                <i className="fas fa-chevron-right text-[8px] opacity-0 group-hover:opacity-100 transition-all"></i>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full px-4 py-3 rounded-xl font-black text-[9px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </AppDialog>
    )
}

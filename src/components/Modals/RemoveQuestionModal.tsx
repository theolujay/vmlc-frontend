"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import clsx from 'clsx'
import Spinner from '../ui/spinner/spinner'
import useDeleteQuestion from '@/hooks/useDeleteQuestion'
import { useCallback } from 'react';

export default function RemoveQuestionModal({ open, close, question_id }: Readonly<{ open: boolean, close: (close: boolean) => void, question_id: number }>) {

    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { onSubmit, isPending } = useDeleteQuestion(handleClose);

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-md w-full mx-auto font-sans text-center">
                <div className="header bg-white p-8 border-b border-gray-50 flex flex-col items-center">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4 animate-pulse">
                        <i className="fas fa-trash-alt text-2xl"></i>
                    </div>
                    <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Delete Question</h2>
                    <p className="text-[11px] text-gray-500 font-medium mt-2">This action is permanent and cannot be undone.</p>
                </div>

                <div className="p-8">
                    <p className='text-sm font-bold text-gray-600 leading-relaxed uppercase tracking-tight'>
                        Are you sure you want to delete this question from the platform? 
                        <span className="block mt-1 text-[10px] text-gray-400 font-medium normal-case italic">It will be removed from all associated exam sessions.</span>
                    </p>

                    <div className="flex gap-4 mt-8 w-full">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(question_id)}
                            disabled={isPending}
                            className={clsx(
                                "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-rose-600 shadow-lg shadow-rose-600/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                            )}
                        >
                            {isPending ? <Spinner /> : (
                                <>
                                    <span>Delete</span>
                                    <i className="fas fa-exclamation-triangle text-[8px]"></i>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AppDialog>
    )
}

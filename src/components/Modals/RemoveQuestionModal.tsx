"use client";
import AppDialog from '@/components/ui/Modals/AppDialog'
import clsx from 'clsx'
import Spinner from '../ui/spinner/spinner'
import useDeleteQuestion from '@/hooks/useDeleteQuestion'
import useUnassignQuestion from '@/hooks/useUnassignQuestion'
import { useCallback } from 'react';

export default function RemoveQuestionModal({ open, close, question_id, exam_id }: Readonly<{ open: boolean, close: (close: boolean) => void, question_id: number, exam_id?: string | number }>) {

    const handleClose = useCallback(() => {
        close(false)
    }, [close])

    const { onSubmit: onDelete, isPending: isDeleting } = useDeleteQuestion(handleClose);
    const { onSubmit: onUnassign, isPending: isUnassigning } = useUnassignQuestion(handleClose);

    const isPending = isDeleting || isUnassigning;
    const isUnassignMode = !!exam_id;

    const handleAction = () => {
        if (isUnassignMode && exam_id) {
            onUnassign(question_id, exam_id);
        } else {
            onDelete(question_id);
        }
    }

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-md w-full mx-auto font-sans text-center">
                <div className="header bg-white p-8 border-b border-gray-50 flex flex-col items-center">
                    <div className={clsx(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-pulse",
                        isUnassignMode ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                    )}>
                        <i className={clsx("fas text-2xl", isUnassignMode ? "fa-unlink" : "fa-trash-alt")}></i>
                    </div>
                    <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>
                        {isUnassignMode ? "Remove Question" : "Delete Question"}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium mt-2">
                        {isUnassignMode 
                            ? "This will unassign the question from this exam session." 
                            : "This action is permanent and cannot be undone."}
                    </p>
                </div>

                <div className="p-8">
                    <p className='text-sm font-bold text-gray-600 leading-relaxed uppercase tracking-tight'>
                        {isUnassignMode 
                            ? "Are you sure you want to remove this question from this session?" 
                            : "Are you sure you want to delete this question from the portal?"}
                        <span className="block mt-1 text-[10px] text-gray-400 font-medium normal-case italic">
                            {isUnassignMode 
                                ? "The question will still remain in the question pool for other exams."
                                : "It will be removed from all associated exam sessions."}
                        </span>
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
                            onClick={handleAction}
                            disabled={isPending}
                            className={clsx(
                                "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2",
                                isUnassignMode 
                                    ? "bg-amber-600 shadow-amber-600/20 hover:bg-amber-700" 
                                    : "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700",
                                isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                            )}
                        >
                            {isPending ? <Spinner /> : (
                                <>
                                    <span>{isUnassignMode ? "Remove" : "Delete"}</span>
                                    <i className={clsx("fas text-[8px]", isUnassignMode ? "fa-minus-circle" : "fa-exclamation-triangle")}></i>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AppDialog>
    )
}


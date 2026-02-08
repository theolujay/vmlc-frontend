'use client';

import AppDialog from '@/components/ui/Modals/AppDialog'
import useListExams from '@/hooks/useListExams'
import clsx from 'clsx'
import { useState, useCallback, useEffect } from 'react'
import useBulkAddQuestionsToSession from '@/hooks/useBulkAddQuestionsToSession'
import { SelectItem } from '@/types/Index'
import MultiSelectDropdown from '../ui/MultiSelect'
import Spinner from '../ui/spinner/spinner'
import { formatExamTitle } from '@/utils/generalUtils';
import useGetStatOverview from '@/hooks/useGetStatOverview';

export default function AddToExamSessionModal({
    open,
    close,
    selectedQuestionIds
}: Readonly<{ open: boolean; close: (close: boolean) => void, selectedQuestionIds: number[] }>) {
    const handleClose = useCallback(() => {
        close(false)
        setSelected([])
    }, [close])

    const [selected, setSelected] = useState<SelectItem[]>([])
    const { data } = useListExams(1) // Just get the first page for selection or we might need more
    const { onSubmit, isPending, isSuccess } = useBulkAddQuestionsToSession(handleClose)
    const { data: statOverview } = useGetStatOverview()

    const selectedSessionIds = selected.map((val) => val.id)
    const payload = { question_ids: selectedQuestionIds, exam_ids: selectedSessionIds };
    const sessionItems: SelectItem[] = data?.results
        ? data.results
            .filter((val) => val.status.toLowerCase() === 'draft')
            .map((val) => ({ id: val.id, label: formatExamTitle(val.title) }))
        : [];

    useEffect(() => {
        if (isSuccess) {
            handleClose()
        }
    }, [isSuccess, handleClose])

    return (
        <AppDialog open={open} onOpenChange={close}>
            <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans text-left">
                <div className="header bg-white p-8 border-b border-gray-50">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
                            <i className="fas fa-layer-group text-xl"></i>
                        </div>
                        <div>
                            <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>{statOverview?.competition?.active_competition || 'Exams & Questions'}</p>
                            <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Add To Exam Session</h2>
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">Add {selectedQuestionIds.length} selected question{selectedQuestionIds.length !== 1 ? 's' : ''} to one or more exam sessions.</p>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <form onSubmit={function (e) {
                        e.preventDefault()
                        if (selected.length === 0) return;
                        onSubmit(payload)
                    }} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="exam" className='text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                <i className="fas fa-calendar-check text-[#3E4095]"></i>
                                Select Exam Sessions <span className="text-red-500">*</span>
                            </label>
                            
                            <MultiSelectDropdown 
                                onChange={setSelected} 
                                selected={selected} 
                                items={sessionItems} 
                                placeholder="Choose sessions..."
                            />
                        </div>

                        {/* 🟣 Display selected items */}
                        {selected.length > 0 && (
                            <div className="bg-white/50 p-4 rounded-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h3 className="text-[9px] font-black text-[#3E4095] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E4095]"></span>
                                    Selected ({selected.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selected.map((exam, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-[#3E4095]/5 border border-[#3E4095]/10 rounded-lg flex items-center gap-2 group">
                                            <span className="text-[10px] font-bold text-[#3E4095]">{exam.label}</span>
                                            <button 
                                                type="button"
                                                onClick={() => setSelected(prev => prev.filter(p => p.id !== exam.id))}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <i className="fas fa-times text-[8px]"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-4 w-full">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending || selected.length === 0}
                                className={clsx(
                                    "flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                                    (isPending || selected.length === 0) && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                                )}
                            >
                                {isPending ? <Spinner /> : (
                                    <>
                                        <span>Add to Sessions</span>
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








'use client';

import AppDialog from '@/components/ui/Modals/AppDialog'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer'
import useListExams from '@/hooks/useListExams'
import clsx from 'clsx'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useBulkAddQuestionsToSession from '@/hooks/useBulkAddQuestionsToSession'
import { SelectItem } from '@/types/Index'
import MultiSelectDropdown from '../ui/MultiSelect'
import Spinner from '../ui/spinner/spinner'




export default function AddToExamSessionModal({
    open,
    close,
    selectedQuestionIds
}: Readonly<{ open: boolean; close: (close: boolean) => void, selectedQuestionIds: number[] }>) {
    function handleClose() {
        close(false)
    }
    const searchParams = useSearchParams()
    const initialPage = Number(searchParams.get('page') || 1)
    const [currentPage] = useState(initialPage)
    const [selected, setSelected] = useState<SelectItem[]>([])
    const { data } = useListExams(currentPage)
    const { onSubmit, isPending } = useBulkAddQuestionsToSession(handleClose)
    const selectedSessionIds = selected.map((val) => val.id)
    const payload = { question_ids: selectedQuestionIds, exam_ids: selectedSessionIds };
    const sessionItems: SelectItem[] = data?.results.map((val) => ({ id: val.id, label: val.title })) ?? [];

    return (
        <AppDialog open={open}>
            <div className="flex bg-[#f0f2f5] rounded-md z-50 flex-col gap-2">
                <div className="header rounded-tl-md rounded-tr-md bg-white p-3 shadow-sm">
                    <h2 className="text-2xl">Add To Exam Session</h2>
                </div>

                <div className="p-2">
                    <ResponsiveContainer className="rounded-md p-4">
                        {/* <FormProvider {...form}> */}
                        <form onSubmit={function (e) {
                            e.preventDefault()
                            onSubmit(payload)
                        }} className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="exam" className="mb-1">
                                    EXAM SESSION
                                </label>
                                {/* <select
                    multiple
                    className="rounded-md border-[#D0D5DD] outline-none p-3 border"
                    id="exam"
                    onChange={handleSelectChange}
                  >
                    {data?.results.map((val: any, index: number) => (
                      <option key={`option-${index}`} value={val.title}>
                        {val.title}
                      </option>
                    ))}
                  </select> */}
                                {/* <SelectInput items={sessionItems}/> */}
                                <MultiSelectDropdown onChange={setSelected} selected={selected} items={sessionItems} />
                            </div>

                            {/* 🟣 Display selected items */}
                            {selected.length > 0 && (
                                <div className="bg-white p-3 rounded-md border border-gray-200 mt-2">
                                    <h3 className="font-semibold mb-2 text-sm">Selected Exams:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {selected.map((exam, i) => (
                                            <li key={i}>{exam.label}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2 mt-4 w-full">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-lg font-semibold cursor-pointer border border-[#E4E7EC] text-gray-700"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    className={clsx(
                                        'px-4 py-2 font-semibold rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]'
                                    )}
                                >
                                    {isPending ?
                                        <Spinner /> :
                                        "PROCEED TO ADD"
                                    }

                                </button>
                            </div>
                        </form>
                        {/* </FormProvider> */}
                    </ResponsiveContainer>
                </div>
            </div>
        </AppDialog>
    )
}








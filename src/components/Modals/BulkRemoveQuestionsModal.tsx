import AppDialog from '@/components/ui/Modals/AppDialog'
import clsx from 'clsx'
import { ModalDeleteIcon } from '../Admin/AdminIcons'
import Spinner from '../ui/spinner/spinner'
import useDeleteQuestion from '@/hooks/useDeleteQuestion'
import useBulkArchiveQuestions from '@/hooks/useBulkArchiveQuestions'

export default function BulkRemoveQuestionsModal({ open, close, questions }: Readonly<{ open: boolean, close: (close: boolean) => void, questions: number[] }>) {

    function handleClose() {
        close(!open)
    }

    const { onSubmit, isPending } = useBulkArchiveQuestions(handleClose);
    return (
        <AppDialog open={open}>
            <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
                <span><ModalDeleteIcon /></span>
                <h2 className='font-bold text-xl'>Deleting {questions.length} question{questions.length>1&&'s'}</h2>
                <p className='text-center'>Clicking the delete questions button will delete these questions from the platform. Do you wish to proceed?</p>
                <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg font-bold cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => onSubmit({ question_ids: questions })}
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer font-bold flex-1 text-white bg-[#D42620]")}
                    >

                        {isPending ? <Spinner /> : 'DELETE QUESTIONS'}

                    </button>
                </div>
            </div>
        </AppDialog>
    )
}

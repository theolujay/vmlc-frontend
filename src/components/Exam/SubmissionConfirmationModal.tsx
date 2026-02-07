import clsx from 'clsx'
import AppDialog from '../ui/Modals/AppDialog'
import Spinner from '../ui/spinner/spinner'

export default function SubmissionConfirmationModal({ open, close, totalAnswered, totalQuestions, handleSubmit, isPending }: { open: boolean, close: (close: boolean) => void, totalAnswered: number, totalQuestions: number, handleSubmit: () => void, isPending: boolean }) {
    function handleClose() {
        close(false)
    }
    
    const remaining = totalQuestions - totalAnswered;

    return (
        <AppDialog open={open} onOpenChange={handleClose}>
            <div className="flex flex-col p-8 bg-white items-center text-center rounded-tr">
                <div className="w-20 h-20 bg-[#3E4095]/5 rounded-[2rem] flex items-center justify-center text-[#3E4095] mb-8">
                    <i className="fas fa-paper-plane text-3xl"></i>
                </div>
                
                <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Ready to submit?</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
                    You have answered <span className="font-bold text-gray-800">{totalAnswered}</span> out of <span className="font-bold text-gray-800">{totalQuestions}</span> questions.
                    {remaining > 0 && (
                        <span className="block mt-2 text-amber-500 font-bold uppercase text-[10px] tracking-widest bg-amber-50 py-1 px-3 rounded-full w-fit mx-auto">
                           <i className="fas fa-exclamation-triangle mr-1"></i> {remaining} questions remaining
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all active:scale-95"
                    >
                        Review Answers
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className={clsx(
                            "flex-[1.5] py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white bg-[#3E4095] shadow-xl shadow-[#3E4095]/20 hover:bg-[#2d2f6e] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center",
                            isPending && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isPending ? <Spinner /> : 'Yes, Submit My Exam'}
                    </button>
                </div>
            </div>
        </AppDialog>
    )
}

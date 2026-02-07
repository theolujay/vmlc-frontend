import AppDialog from '../ui/Modals/AppDialog'
import Link from 'next/link'

export default function SuccessfulModal({ open }: { open: boolean }) {

  return (
    <AppDialog open={open}>
      <div className="flex flex-col p-10 bg-white items-center text-center">
        <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center text-green-500 mb-8 animate-bounce">
            <i className="fas fa-check-circle text-4xl"></i>
        </div>
        
        <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-4">Congratulations!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
            Your exam responses have been submitted successfully! You can now relax while we process your results. We&apos;ll notify you via email once they&apos;re ready.
        </p>

        <Link 
            href="/exam-portal"
            className="w-full py-5 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-gray-900 shadow-xl shadow-gray-900/20 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
        >
            Return to Dashboard
        </Link>
      </div>
    </AppDialog>
  )
}

import AppDialog from '@/components/ui/Modals/AppDialog'
import useDeleteExamSession from '@/hooks/useDeleteExamSession'
import clsx from 'clsx'
import { ModalDeleteIcon } from '../Admin/AdminIcons'
import Spinner from '../ui/spinner/spinner'

export default function DeleteExamSessionModal({ open, close ,session_id}:Readonly< { open: boolean, close: (close: boolean) => void ,session_id:string }>) {
    const {isPending,onSubmit}=useDeleteExamSession(handleClose)
     function handleClose() {
        close(!open)
    }
  return (
    <AppDialog open={open}>
        <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
            <span><ModalDeleteIcon/></span>
            <h2 className='font-bold text-xl'>Delete exam session</h2>
            <p className='text-center'>Pressing the delete session button will permanently remove this session. Are you sure you want to continue?</p>
             <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg font-bold cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                    onClick={()=>onSubmit(session_id)}         
                    className={clsx("px-4 py-2 rounded-lg cursor-pointer font-bold flex-1 text-white bg-[#D42620]" )}
                    >
                        {isPending?<Spinner/>:'DELETE EXAM SESSION'}
                    
                    </button>
                </div>
        </div>
    </AppDialog>
  )
}

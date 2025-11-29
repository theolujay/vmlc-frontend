import AppDialog from '@/components/ui/Modals/AppDialog'
import usePublishLeaderboard from '@/hooks/usePublishLeaderboard'
import clsx from 'clsx'
import { ModalConfirmationIcon } from '../Admin/AdminIcons'
import Spinner from '../ui/spinner/spinner'

export default function UploadConfirmationModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    function handleClose() {
        close(!open)
    }
    const { onSubmit,isPending } = usePublishLeaderboard(handleClose)
    return (
        <AppDialog open={open}>
            <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
                <span><ModalConfirmationIcon /></span>
                <h2 className='font-semibold text-lg'>{`You're`} about to upload the leaderboard results</h2>
                <p>Are you sure you want to upload the leaderboard results to all participants? Please confirm if you want to proceed.</p>
                <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 font-semibold rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isPending}
                        className={clsx("px-4 py-2 rounded-lg font-semibold cursor-pointer flex-1 text-white bg-[#3E4095]")}
                    >
                        {isPending?<Spinner/>:'CONFIRM UPDATE'}
                        
                    </button>
                </div>
            </div>
        </AppDialog>
    )
}

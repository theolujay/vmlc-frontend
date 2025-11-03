import clsx from 'clsx'
import AppDialog from '@/components/ui/Modals/AppDialog'
import { LogoutIcon } from '../Admin/AdminIcons'
import useLogout from '@/hooks/useLogout'

export default function LogOutModal({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {
    const { onLogout } = useLogout(handleClose)
    function handleClose() {
        close(!open)
    }
    return (
        <AppDialog open={open}>
            <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
                <span><LogoutIcon /></span>
                <h2 className='font-bold text-xl'>Are you sure you want to log out?</h2>
                <p>You are about to logged out of your account. If you continue, you will be signed out and redirected to the login page. Do you wish to proceed?</p>
                <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg font-bold cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onLogout}
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer font-bold flex-1 text-white bg-[#D42620]")}
                    >
                        PROCEED TO LOG OUT
                    </button>
                </div>
            </div>
        </AppDialog>
    )
}

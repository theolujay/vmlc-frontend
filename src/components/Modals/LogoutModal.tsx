import clsx from 'clsx'
import AppDialog from '@/components/ui/Modals/AppDialog'
import { LogoutIcon } from '../Admin/AdminIcons'

export default function LogOutModal({ open, close }: { open: boolean, close: (close: boolean) => void }) {
     function handleClose() {
        close(!open)
    }
  return (
    <AppDialog open={open}>
        <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
            <span><LogoutIcon/></span>
            <h2>Are you sure you want to log out?</h2>
            <p>You are about to log out of your account. If you continue, you will be signed out and redirected to the login page.Do you wish to proceed?</p>
             <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        CANCEL
                    </button>
                    <button         
                        className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]" )}
                    >
                    PROCEED TO LOG OUT
                    </button>
                </div>
        </div>
    </AppDialog>
  )
}

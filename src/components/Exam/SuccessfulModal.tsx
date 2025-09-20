import clsx from 'clsx'
import { OverviewIcon } from '../General/GeneralIcon'
import AppDialog from '../ui/Modals/AppDialog'

export default function SuccessfulModal({ open }: { open: boolean }) {

  return (
    <AppDialog open={open}>
      <div className="flex flex-col gap-3 p-4 bg-white items-center shadow-sm rounded-lg">
        <span><OverviewIcon /></span>
        <h2>Well done!</h2>
        <p>Your exam responses have been submitted successfully! {`You’ll`} receive your results through your dashboard and email. Best of luck!</p>

        <div className="flex gap-2 mt-4 w-full">

          <button
            className={clsx("px-4 py-2 rounded-lg cursor-pointer flex-1 text-white bg-[#3E4095]")}
          >
            GO TO OVERVIEW
          </button>
        </div>
      </div>
    </AppDialog>
  )
}

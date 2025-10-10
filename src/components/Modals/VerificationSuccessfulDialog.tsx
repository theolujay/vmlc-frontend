"use client"
import AppDialog from '@/components/ui/Modals/AppDialog';
import { VerifiedSuccessIcon } from '../General/GeneralIcon';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/router';

export default function VerificationSuccessfulDialog({ open, close }: Readonly<{ open: boolean, close: (close: boolean) => void }>) {

  const router=useRouter()


  function navigateToStartPage(){
    router.push('/get-started')
  }

  function handleClose() {
    close(!open)
  }

  return (
    <AppDialog open={open}>
      <div className="bg-white rounded-lg p-6 gap-2 w-[500px] flex flex-col items-center">
        <div>
          <VerifiedSuccessIcon />
        </div>
        <h2 className='font-bold text-xl'>Verification uploaded Successfully</h2>
        <p>Your verification has been successfully uploaded! While you wait for the {`admin's`} approval, feel free to visit the tour guide page</p>
        <div className="flex gap-2 mt-4 w-full">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg uppercase font-semibold cursor-pointer border border-[#E4E7EC] outline-0 text-gray-700"
          >
            Close
          </button>
          <button
          onClick={navigateToStartPage}
            // onClick={capture}
            className="px-4 py-2 rounded-lg uppercase cursor-pointer flex-1 bg-[#3E4095] font-semibold text-white"
          >
            Go To Your Tour Guide Page
          </button>
        </div>


      </div>
    </AppDialog>
  )
}

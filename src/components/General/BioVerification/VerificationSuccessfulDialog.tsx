import AppDialog from '@/components/ui/Modals/AppDialog';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { VerifiedSuccessIcon } from '../GeneralIcon';

export default function VerificationSuccessfulDialog({open,close}:Readonly<{open:boolean,close:(close:boolean)=>void}>) {
     const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // const [circleColor, setCircleColor] = useState("red"); // toggle to green when conditions met

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      // send imageSrc to backend here
    }
  };

  function handleClose(){
    close(!open)
  }

  return (
    <AppDialog open={open}>
        <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col items-center">
      <div>
        <VerifiedSuccessIcon/>
      </div>
      <h2>Verification uploaded Successfully</h2>
      <p>Your verification has been successfully uploaded! While you wait for the {`admin's`} approval, feel free to visit the tour guide page</p>
     

        <div className="flex gap-2 mt-4 w-full">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] outline-0 text-gray-700"
          >
            Close
          </button>
          <button
            onClick={capture}
            className="px-4 py-2 rounded-lg uppercase cursor-pointer flex-1 bg-[#98A2B3] text-white"
          >
            Go To Your Tour Guide Page
          </button>
        </div>

      
      </div>
    </AppDialog>
  )
}

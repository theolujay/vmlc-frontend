import AppDialog from '@/components/ui/Modals/AppDialog'
import React, { useRef, useState } from 'react'
import Webcam from 'react-webcam';

export default function VerificationSuccessfulDialog({open,close}:{open:boolean,close:(close:boolean)=>void}) {
     const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [circleColor, setCircleColor] = useState("red"); // toggle to green when conditions met

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
        <h2 className="text-lg font-bold">Image Capture</h2>
        <p className="text-lg text-gray-600 text-center mb-4">
          Please move and position your face to fit the frame and click capture
          when the red circle turns green
        </p>

        <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
          {/* Webcam */}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full h-full object-cover"
          />

          {/* Circle overlay */}
          <div
            className={`absolute inset-0 border-4 rounded-full pointer-events-none`}
            style={{ borderColor: circleColor }}
          />

          {/* Face outline (optional SVG or dashed border) */}
          {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg width="180" height="200">
              <path
                d="M90 20 C120 40, 140 80, 140 140 C140 170, 40 170, 40 140 C40 80, 60 40, 90 20 Z"
                stroke="green"
                strokeDasharray="6 6"
                fill="none"
              />
            </svg>
          </div> */}
        </div>

        <div className="flex gap-2 mt-4 w-full">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] outline-0 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={capture}
            className="px-4 py-2 rounded-lg cursor-pointer flex-1 bg-[#98A2B3] text-white"
          >
            Capture
          </button>
        </div>

        {capturedImage && (
          <img src={capturedImage} alt="Captured" className="mt-4 rounded" />
        )}
      </div>
    </AppDialog>
  )
}

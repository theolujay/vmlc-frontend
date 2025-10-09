import AppDialog from '@/components/ui/Modals/AppDialog'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import * as faceapi from "face-api.js";
import clsx from 'clsx';
import Image from 'next/image';

const CIRCLE_SIZE = 250;
const FRAME_WIDTH = 250;
const FRAME_HEIGHT = 250;

export default function CaptureDialog({ open, close }: { open: boolean, close: (close: boolean) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [isAligned, setIsAligned] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 160,
      scoreThreshold: 0.4,
    });

    const interval = setInterval(async () => {
      if (!webcamRef.current?.video) return;
      const video = webcamRef.current.video;

      const detections = await faceapi
        .detectSingleFace(video, options)
        .withFaceLandmarks();

      if (detections) {
        const box = detections.detection.box;
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        const circleCenter = FRAME_WIDTH / 2;
        const dx = Math.abs(centerX - circleCenter);
        const dy = Math.abs(centerY - circleCenter);
        const radius = CIRCLE_SIZE / 2;

        const isCentered = dx < radius / 2 && dy < radius / 2;
        const isSized = box.width > radius * 0.6 && box.width < radius * 1.4;

        setIsAligned(isCentered && isSized);
      } else {
        setIsAligned(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // const capture = () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     setCapturedImage(imageSrc);
  //   }
  // };



  const handleRecapture = () => {
    setCapturedImage(null);
    setIsAligned(false);
  };

   const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);

      // ✅ Stop webcam stream after capture
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  console.log(capturedImage,'from captured image')
  function handleClose() {
    close(!open);
  }

  return (
    <AppDialog open={open}>
      <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col items-center">
        <h2 className="text-lg font-bold">Image Capture</h2>
        <p className="text-lg text-gray-600 text-center mb-4">
          Position your face within the circle. The border turns green when aligned.
        </p>




        {capturedImage? <div className="flex capture flex-col">

        <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
          <Image
          alt='User'
          height={FRAME_HEIGHT}
          width={FRAME_WIDTH}
            // ref={webcamRef}
            // screenshotFormat="image/jpeg"
            // videoConstraints={{ facingMode: "user", width: FRAME_WIDTH, height: FRAME_HEIGHT }}
            // className="w-full h-full object-cover"
            src={capturedImage}
          />
          <div
            className={`absolute inset-0 border-4 rounded-full pointer-events-none`}
            style={{
              borderColor:  'limegreen',
              width: `${CIRCLE_SIZE}px`,
              height: `${CIRCLE_SIZE}px`,
              margin: "auto",
            }}
          />
        </div>




        






        <div className="flex gap-2 mt-4 w-full">
          <button onClick={handleRecapture} className="px-4 py-2 font-bold cursor-pointer rounded-lg border border-gray-300 text-gray-700">
            RECAPTURE
          </button>
          <button  className={clsx("px-4 cursor-pointer py-2 rounded-lg flex-1 bg-[#3E4095] text-white")}>
            UPLOAD
          </button>
        </div>
        </div>:
        <div className="flex capture flex-col">

        <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user", width: FRAME_WIDTH, height: FRAME_HEIGHT }}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 border-4 rounded-full pointer-events-none`}
            style={{
              borderColor: isAligned ? 'limegreen' : 'red',
              width: `${CIRCLE_SIZE}px`,
              height: `${CIRCLE_SIZE}px`,
              margin: "auto",
            }}
          />
        </div>

        <div className="flex gap-2 mt-4 w-full">
          <button onClick={handleClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">
            Cancel
          </button>
          <button onClick={capture} disabled={!isAligned} className={clsx("px-4 uppercase font-bold cursor-pointer py-2 rounded-lg flex-1  text-white",isAligned?'bg-[#3E4095] hover:bg-[#2d2f6e]':'bg-[#98A2B3]')}>
            Capture
          </button>
        </div>
        </div>
        }


        
      </div>
    </AppDialog>
  );
}

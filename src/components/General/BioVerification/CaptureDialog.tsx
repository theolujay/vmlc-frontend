


"use client";

import AppDialog from '@/components/ui/Modals/AppDialog'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import * as faceapi from "face-api.js";
import clsx from 'clsx';
import Image from 'next/image';
import { dataURLtoFile } from '@/utils/formatFileSize';
import Spinner from '@/components/ui/spinner/spinner';

const CIRCLE_SIZE = 250;
const FRAME_WIDTH = 250;
const FRAME_HEIGHT = 250;

export default function CaptureDialog({
  open,
  close,
  onCaptureFile,
  isPending
}: {
  open: boolean;
  close: (close: boolean) => void;
  onCaptureFile: (file: File) => void;
  isPending: boolean;
}) {
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

      // Ensure video is ready and has dimensions
      if (video.readyState !== 4 || video.videoWidth === 0) return;

      try {
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
      } catch (error) {
        console.error("Face detection error in CaptureDialog:", error);
        setIsAligned(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  const handleRecapture = () => {
    setCapturedImage(null);
    setIsAligned(false);
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) return;
      setCapturedImage(imageSrc);

      // Stop webcam stream after capture
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (stream) stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleUpload = () => {
    if (!capturedImage) return;
    const file = dataURLtoFile(capturedImage, "profile_photo.jpg");
    onCaptureFile(file);
  };

  const handleClose = () => close(false);

  return (
    <AppDialog open={open} onOpenChange={close}>
      <div className="flex bg-[#F7F9FC] rounded-[2rem] z-50 flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-full mx-auto font-sans">
        <div className="header bg-white p-8 border-b border-gray-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-camera text-xl"></i>
            </div>
            <div>
              <p className='text-[9px] text-gray-400 font-black uppercase tracking-widest'>Identity Verification</p>
              <h2 className='text-xl font-bold text-gray-800 tracking-tight uppercase'>Face Capture</h2>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Position your face within the circle. Ensure your environment is well-lit for accurate verification.
          </p>
        </div>

        <div className="p-8 flex flex-col items-center">
          {capturedImage ? (
            <div className="flex flex-col items-center w-full">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#3E4095] to-[#01ACEA] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-[260px] h-[260px] rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    alt="Captured face"
                    height={260}
                    width={260}
                    src={capturedImage}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className="absolute inset-0 border-[6px] rounded-full pointer-events-none"
                    style={{
                      borderColor: 'limegreen',
                      margin: "2px",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10 w-full">
                <button
                  onClick={handleRecapture}
                  className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-white hover:text-[#3E4095] transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <i className="fas fa-redo-alt mr-2 text-[8px]"></i>
                  Recapture
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isPending}
                  className={clsx(
                    "flex-[1.5] px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2",
                    isPending && "opacity-70 cursor-not-allowed translate-y-0 shadow-none"
                  )}
                >
                  {isPending ? <Spinner /> : (
                    <>
                      <span>Upload & Proceed</span>
                      <i className="fas fa-check text-[8px]"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="relative">
                 {!modelsLoaded && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm rounded-full">
                        <Spinner size={32} color="#3E4095" />
                        <p className="mt-4 text-[9px] font-black text-[#3E4095] uppercase tracking-widest animate-pulse">Initializing AI...</p>
                    </div>
                 )}
                 <div className={clsx(
                    "relative w-[260px] h-[260px] rounded-full overflow-hidden border-4 bg-gray-100 shadow-inner transition-colors duration-500",
                    isAligned ? "border-emerald-400 shadow-emerald-100" : "border-white"
                 )}>
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: "user",
                        width: FRAME_WIDTH,
                        height: FRAME_HEIGHT,
                      }}
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Alignment Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={clsx(
                            "w-[200px] h-[200px] border-2 border-dashed rounded-full transition-all duration-300",
                            isAligned ? "border-emerald-400 scale-105" : "border-white/40 scale-100"
                        )} />

                        {/* Corner markers for visual interest */}
                        <div className={clsx(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border-t-2 border-l-2 rounded-tl-[60px] transition-all",
                            isAligned ? "border-emerald-400 opacity-100" : "border-white/20 opacity-0"
                        )} style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }} />
                    </div>
                 </div>

                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white shadow-lg border border-gray-50 flex items-center gap-2 whitespace-nowrap z-10">
                    <div className={clsx("w-2 h-2 rounded-full", isAligned ? "bg-emerald-500 animate-pulse" : "bg-red-400")}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">
                        {isAligned ? 'Ready to Capture' : 'Position your face'}
                    </span>
                 </div>
              </div>

              <div className="flex gap-4 mt-12 w-full">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-white hover:text-gray-600 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={capture}
                  disabled={!isAligned}
                  className={clsx(
                    "flex-[1.5] px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white transition-all cursor-pointer flex items-center justify-center gap-2",
                    isAligned
                      ? "bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5"
                      : "bg-[#98A2B3] cursor-not-allowed shadow-none"
                  )}
                >
                  <i className="fas fa-camera text-[10px]"></i>
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppDialog>
  );
}

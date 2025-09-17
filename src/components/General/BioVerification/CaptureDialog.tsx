// import AppDialog from '@/components/ui/Modals/AppDialog'
// import React, { useEffect, useRef, useState } from 'react'
// import Webcam from 'react-webcam';
// import * as faceapi from "face-api.js";

// const CIRCLE_SIZE = 250;
// const FRAME_WIDTH = 400;
// const FRAME_HEIGHT = 300;

// export default function CaptureDialog({ open, close }: { open: boolean, close: (close: boolean) => void }) {
//     const webcamRef = useRef<Webcam>(null);
//     const [isAligned, setIsAligned] = useState(false)
//     const [capturedImage, setCapturedImage] = useState<string | null>(null);
//     const [modelsLoaded, setModelsLoaded] = useState(false)

//     useEffect(() => {
//         const loadModels = async () => {
//             const MODEL_URL = "/models";

//             await Promise.all([
//                 faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//                 faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//             ])
//             setModelsLoaded(true)
//         }
//         loadModels();
//     }, []);


//     useEffect(() => {
//         let interval: NodeJS.Timeout;
//         if (!modelsLoaded) return
// //         const detect = async () => {
// //             if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
// //                 const video = webcamRef.current.video;

// //                 const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

// //                 if (detections) {
// //                     const box = detections.detection.box;
// //                     const centerX = box.x + box.width / 2;
// //                     const centerY = box.y + box.height / 2;


// //                     // const circleCenterX = FRAME_WIDTH / 2;
// //                     // const circleCenterY = FRAME_HEIGHT / 2;
// //                     const circleCenterX = CIRCLE_SIZE / 2;
// // const circleCenterY = CIRCLE_SIZE / 2;


// //                     const dx = Math.abs(centerX - circleCenterX);
// //                     const dy = Math.abs(centerY - circleCenterY);

// //                     const radius = CIRCLE_SIZE / 2;
// //                     const isCentered = dx < radius / 3 && dy < radius / 3;
// //                     // const isSized = box.width > radius * 0.9 && box.width < radius * 1.2;
// // const isSized = box.width > radius * 0.6 && box.width < radius * 1.4;

// //                     setIsAligned(isCentered && isSized);

// //                 } else {
// //                     setIsAligned(false)
// //                 }
// //             }
// //         };
// const detect = async () => {
//   if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
//     const video = webcamRef.current.video;

//     const detections = await faceapi
//       .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks();

//     if (detections) {
//       const box = detections.detection.box;
//       const centerX = box.x + box.width / 2;
//       const centerY = box.y + box.height / 2;

//       // Circle is 250x250, so its center is (125,125)
//       const circleCenterX = CIRCLE_SIZE / 2;
//       const circleCenterY = CIRCLE_SIZE / 2;

//       const dx = Math.abs(centerX - circleCenterX);
//       const dy = Math.abs(centerY - circleCenterY);

//       const radius = CIRCLE_SIZE / 2;
//       const isCentered = dx < radius / 2 && dy < radius / 2;
//       const isSized = box.width > radius * 0.6 && box.width < radius * 1.4;

//       setIsAligned(isCentered && isSized);
//     } else {
//       setIsAligned(false);
//     }
//   }
// };

//         interval = setInterval(detect, 300);
//         return () => clearInterval(interval);
//     },[modelsLoaded])



//     const capture = () => {
//         if (webcamRef.current) {
//             const imageSrc = webcamRef.current.getScreenshot();
//             setCapturedImage(imageSrc);
//             // send imageSrc to backend here
//         }
//     };

//     function handleClose() {
//         close(!open)
//     }

//     return (
//         <AppDialog open={open}>
//             <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col items-center">
//                 <h2 className="text-lg font-bold">Image Capture</h2>
//                 <p className="text-lg text-gray-600 text-center mb-4">
//                     Please move and position your face to fit the frame and click capture
//                     when the red circle turns green
//                 </p>

//                 <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden">
//                     {/* Webcam */}
//                     <Webcam
//                         ref={webcamRef}
//                         screenshotFormat="image/jpeg"
//                         videoConstraints={{ facingMode: "user",width:FRAME_WIDTH,height:FRAME_HEIGHT }}
//                         className="w-full h-full object-cover"
//                     />

//                     {/* Circle overlay */}
//                     <div
//                         className={`absolute inset-0 border-4 rounded-full pointer-events-none`}
//                         style={{ borderColor: isAligned ? 'limegreen' : 'red', width: `${CIRCLE_SIZE}px`, height: `${CIRCLE_SIZE}px`, margin: "auto" }}
//                     />

                   
//                 </div>

//                 <div className="flex gap-2 mt-4 w-full">
//                     <button
//                         onClick={handleClose}
//                         className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] outline-0 text-gray-700"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={capture}
//                         className="px-4 py-2 rounded-lg cursor-pointer flex-1 bg-[#98A2B3] text-white"
//                     >
//                         Capture
//                     </button>
//                 </div>

//                 {capturedImage && (
//                     <img src={capturedImage} alt="Captured" className="mt-4 rounded" />
//                 )}
//             </div>
//         </AppDialog>
//     )
// }


// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import AppDialog from "@/components/ui/Modals/AppDialog";

// const CIRCLE_SIZE = 250;
// const FRAME_WIDTH = 400;
// const FRAME_HEIGHT = 300;

// export default function CaptureDialog({
//   open,
//   close,
// }: {
//   open: boolean;
//   close: (close: boolean) => void;
// }) {
//   const webcamRef = useRef<Webcam>(null);
//   const [isAligned, setIsAligned] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models"; // <-- put models folder in /public/models
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//       ]);
//       setModelsLoaded(true);
//     };
//     loadModels();
//   }, []);

//   // Face detection loop
//   useEffect(() => {
//     if (!modelsLoaded) return;

//     let interval: NodeJS.Timeout;

//     const detect = async () => {
//       if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video as HTMLVideoElement;

//         const detection = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         if (detection) {
//           const box = detection.detection.box;
//           const centerX = box.x + box.width / 2;
//           const centerY = box.y + box.height / 2;

//           // Circle is centered in FRAME_WIDTH x FRAME_HEIGHT
//           const circleCenterX = FRAME_WIDTH / 2; // 200
//           const circleCenterY = FRAME_HEIGHT / 2; // 150
//           const radius = CIRCLE_SIZE / 2;

//           const dx = Math.abs(centerX - circleCenterX);
//           const dy = Math.abs(centerY - circleCenterY);

//           const isCentered = dx < radius / 2 && dy < radius / 2;
//           const isSized = box.width > radius * 0.8 && box.width < radius * 1.2;

//           setIsAligned(isCentered && isSized);
//         } else {
//           setIsAligned(false);
//         }
//       }
//     };

//     interval = setInterval(detect, 300);
//     return () => clearInterval(interval);
//   }, [modelsLoaded]);

//   const capture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//       // send imageSrc to backend here
//     }
//   };

//   function handleClose() {
//     close(!open);
//   }

//   return (
//     <AppDialog open={open}>
//       <div className="bg-white rounded-lg p-6 w-[420px] flex flex-col items-center">
//         <h2 className="text-lg font-bold">Image Capture</h2>
//         <p className="text-gray-600 text-center mb-4">
//           Please move and position your face to fit the frame. The circle will
//           turn green when aligned.
//         </p>

//         <div className="relative w-[400px] h-[300px]">
//           {/* Webcam */}
//           <Webcam
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             videoConstraints={{
//               facingMode: "user",
//               width: FRAME_WIDTH,
//               height: FRAME_HEIGHT,
//             }}
//             className="w-full h-full object-cover rounded-lg"
//           />

//           {/* Circle overlay */}
//           <div
//             className="absolute border-4 rounded-full pointer-events-none"
//             style={{
//               borderColor: isAligned ? "limegreen" : "red",
//               width: `${CIRCLE_SIZE}px`,
//               height: `${CIRCLE_SIZE}px`,
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           />
//         </div>

//         <div className="flex gap-2 mt-4 w-full">
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={capture}
//             className="px-4 py-2 rounded-lg flex-1 bg-blue-600 text-white"
//             disabled={!isAligned}
//           >
//             Capture
//           </button>
//         </div>

//         {capturedImage && (
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="mt-4 rounded shadow-md"
//           />
//         )}
//       </div>
//     </AppDialog>
//   );
// }


// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import AppDialog from "@/components/ui/Modals/AppDialog";

// const CIRCLE_SIZE = 250;
// const FRAME_WIDTH = 400;
// const FRAME_HEIGHT = 300;

// export default function CaptureDialog({
//   open,
//   close,
// }: {
//   open: boolean;
//   close: (close: boolean) => void;
// }) {
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isAligned, setIsAligned] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   // Load face-api.js models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models"; // put models in public/models
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//       ]);
//       setModelsLoaded(true);
//     };
//     loadModels();
//   }, []);

//   // Detection loop
//   useEffect(() => {
//     if (!modelsLoaded) return;

//     let interval: NodeJS.Timeout;

//     const detect = async () => {
//       if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video as HTMLVideoElement;
//         const canvas = canvasRef.current;

//         if (!canvas) return;

//         // Match canvas size to video
//         canvas.width = FRAME_WIDTH;
//         canvas.height = FRAME_HEIGHT;

//         const detection = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         const ctx = canvas.getContext("2d");
//         ctx?.clearRect(0, 0, canvas.width, canvas.height);

//         if (detection) {
//           // Draw detection box + landmarks for debugging
//           faceapi.draw.drawDetections(canvas, [detection.detection]);
//           faceapi.draw.drawFaceLandmarks(canvas, [detection]);

//           const box = detection.detection.box;
//           const centerX = box.x + box.width / 2;
//           const centerY = box.y + box.height / 2;

//           // Our target circle is centered in the frame
//           const circleCenterX = FRAME_WIDTH / 2; // 200
//           const circleCenterY = FRAME_HEIGHT / 2; // 150
//           const radius = CIRCLE_SIZE / 2;

//           const dx = Math.abs(centerX - circleCenterX);
//           const dy = Math.abs(centerY - circleCenterY);

//           const isCentered = dx < radius / 2 && dy < radius / 2;
//           const isSized = box.width > radius * 0.8 && box.width < radius * 1.2;

//           setIsAligned(isCentered && isSized);
//         } else {
//           setIsAligned(false);
//         }
//       }
//     };

//     interval = setInterval(detect, 300);
//     return () => clearInterval(interval);
//   }, [modelsLoaded]);

//   const capture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//     }
//   };

//   function handleClose() {
//     close(!open);
//   }

//   return (
//     <AppDialog open={open}>
//       <div className="bg-white rounded-lg p-6 w-[420px] flex flex-col items-center">
//         <h2 className="text-lg font-bold">Image Capture</h2>
//         <p className="text-gray-600 text-center mb-4">
//           Please move and position your face to fit the frame. The circle will
//           turn green when aligned.
//         </p>

//         <div className="relative w-[400px] h-[300px]">
//           {/* Webcam */}
//           <Webcam
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             videoConstraints={{
//               facingMode: "user",
//               width: FRAME_WIDTH,
//               height: FRAME_HEIGHT,
//             }}
//             className="w-full h-full object-cover rounded-lg"
//           />

//           {/* Debug canvas */}
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full"
//           />

//           {/* Circle overlay */}
//           <div
//             className="absolute border-4 rounded-full pointer-events-none"
//             style={{
//               borderColor: isAligned ? "limegreen" : "red",
//               width: `${CIRCLE_SIZE}px`,
//               height: `${CIRCLE_SIZE}px`,
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           />
//         </div>

//         <div className="flex gap-2 mt-4 w-full">
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={capture}
//             className="px-4 py-2 rounded-lg flex-1 bg-blue-600 text-white"
//             disabled={!isAligned}
//           >
//             Capture
//           </button>
//         </div>

//         {capturedImage && (
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="mt-4 rounded shadow-md"
//           />
//         )}
//       </div>
//     </AppDialog>
//   );
// }


// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import AppDialog from "@/components/ui/Modals/AppDialog";

// const CIRCLE_SIZE = 250;
// const FRAME_WIDTH = 400;
// const FRAME_HEIGHT = 300;

// export default function CaptureDialog({
//   open,
//   close,
// }: {
//   open: boolean;
//   close: (close: boolean) => void;
// }) {
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isAligned, setIsAligned] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = "/models";
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//       ]);
//       setModelsLoaded(true);
//     };
//     loadModels();
//   }, []);

//   // Detection loop
//   useEffect(() => {
//     if (!modelsLoaded) return;
//     let interval: NodeJS.Timeout;

//     const detect = async () => {
//       if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
//         const video = webcamRef.current.video as HTMLVideoElement;
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         canvas.width = FRAME_WIDTH;
//         canvas.height = FRAME_HEIGHT;

//         const detection = await faceapi
//           .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         const ctx = canvas.getContext("2d");
//         ctx?.clearRect(0, 0, canvas.width, canvas.height);

//         if (detection) {
//           // Debug drawing
//           faceapi.draw.drawDetections(canvas, [detection.detection]);

//           const box = detection.detection.box;
//           const centerX = box.x + box.width / 2;
//           const centerY = box.y + box.height / 2;

//           // Circle center = frame center
//           const circleCenterX = FRAME_WIDTH / 2;
//           const circleCenterY = FRAME_HEIGHT / 2;
//           const radius = CIRCLE_SIZE / 2;

//           const dx = Math.abs(centerX - circleCenterX);
//           const dy = Math.abs(centerY - circleCenterY);

//           // Looser thresholds for stability
//           const isCentered = dx < radius * 0.6 && dy < radius * 0.6;
//           const isSized = box.width > radius * 0.8 && box.width < radius * 1.3;

//           // Smooth state change (avoid flicker)
//           setIsAligned((prev) => {
//             if (isCentered && isSized) return true;
//             if (!isCentered || !isSized) return false;
//             return prev;
//           });
//         } else {
//           setIsAligned(false);
//         }
//       }
//     };

//     interval = setInterval(detect, 300);
//     return () => clearInterval(interval);
//   }, [modelsLoaded]);

//   const capture = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//     }
//   };

//   function handleClose() {
//     close(!open);
//   }

//   return (
//     <AppDialog open={open}>
//       <div className="bg-white rounded-lg p-6 w-[420px] flex flex-col items-center">
//         <h2 className="text-lg font-bold">Image Capture</h2>
//         <p className="text-gray-600 text-center mb-4">
//           Please move and position your face inside the circle. The circle will
//           turn green when aligned.
//         </p>

//         <div
//           className="relative rounded-lg overflow-hidden"
//           style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
//         >
//           {/* Webcam */}
//           <Webcam
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             videoConstraints={{
//               facingMode: "user",
//               width: FRAME_WIDTH,
//               height: FRAME_HEIGHT,
//             }}
//             className="w-full h-full object-cover"
//           />

//           {/* Debug canvas */}
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 w-full h-full"
//           />

//           {/* Circle overlay (always centered) */}
//           <div
//             className="absolute border-4 rounded-full pointer-events-none"
//             style={{
//               borderColor: isAligned ? "limegreen" : "red",
//               width: `${CIRCLE_SIZE}px`,
//               height: `${CIRCLE_SIZE}px`,
//               left: "50%",
//               top: "50%",
//               transform: "translate(-50%, -50%)",
//             }}
//           />
//         </div>

//         <div className="flex gap-2 mt-4 w-full">
//           <button
//             onClick={handleClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={capture}
//             disabled={!isAligned}
//             className={`px-4 py-2 rounded-lg flex-1 text-white ${
//               isAligned ? "bg-green-600" : "bg-gray-400"
//             }`}
//           >
//             Capture
//           </button>
//         </div>

//         {capturedImage && (
//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="mt-4 rounded shadow-md"
//           />
//         )}
//       </div>
//     </AppDialog>
//   );
// }


import AppDialog from '@/components/ui/Modals/AppDialog'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import * as faceapi from "face-api.js";

const CIRCLE_SIZE = 250;

export default function CaptureDialog({ open, close }: { open: boolean, close: (close: boolean) => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [isAligned, setIsAligned] = useState(false)
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false)

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ])
            setModelsLoaded(true)
        }
        loadModels();
    }, []);

    useEffect(() => {
        // let interval: NodeJS.Timeout;
        if (!modelsLoaded) return
        const detect = async () => {
            if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;

                const detections = await faceapi
                    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks();

                if (detections) {
                    const box = detections.detection.box;
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;

                    const circleCenterX = CIRCLE_SIZE / 2;
                    const circleCenterY = CIRCLE_SIZE / 2;

                    const dx = Math.abs(centerX - circleCenterX);
                    const dy = Math.abs(centerY - circleCenterY);

                    const radius = CIRCLE_SIZE / 2;
                    const isCentered = dx < radius / 3 && dy < radius / 3;
                    const isSized = box.width > radius * 0.9 && box.width < radius * 1.2;

                    setIsAligned(isCentered && isSized);
                } else {
                    setIsAligned(false)
                }
            }
        };
        const interval = setInterval(detect, 300);
        return () => clearInterval(interval);
    }, [modelsLoaded]);

    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
        }
    };

    function handleClose() {
        close(!open)
    }

    return (
        <AppDialog open={open}>
            <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col items-center">
                <h2 className="text-lg font-bold">Image Capture</h2>
                <p className="text-lg text-gray-600 text-center mb-4">
                    Position your face inside the circle. The border turns green when aligned.
                </p>

                {/* Circular container */}
                <div
                    className="relative rounded-full overflow-hidden flex items-center justify-center"
                    style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
                >
                    {/* Webcam */}
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "user" }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Circle border */}
                    <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            border: `4px solid ${isAligned ? "limegreen" : "red"}`,
                        }}
                    />
                </div>

                <div className="flex gap-2 mt-4 w-full">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg cursor-pointer border border-[#E4E7EC] text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={capture}
                        disabled={!isAligned}
                        className={`px-4 py-2 rounded-lg cursor-pointer flex-1 text-white ${
                            isAligned ? "bg-green-600" : "bg-gray-400"
                        }`}
                    >
                        Capture
                    </button>
                </div>

                {capturedImage && (
                    <img src={capturedImage} alt="Captured" className="mt-4 rounded-lg w-[200px]" />
                )}
            </div>
        </AppDialog>
    )
}


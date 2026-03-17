/** @jsxImportSource react */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";
import clsx from "clsx";
import { ViolationType } from "@/types/ViolationType";

interface FaceProctorProps {
  reportViolation?: (
    type: ViolationType,
    metadata?: Record<string, unknown>,
  ) => void;
  registerScreenshotProvider?: (fn: () => string | null) => void;
}

const FaceProctor = ({
  reportViolation,
  registerScreenshotProvider,
}: FaceProctorProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const violationCountRef = useRef({
    noFace: 0,
    multiFace: 0,
    lookingAway: 0,
  });
  const [status, setStatus] = useState<"normal" | "warning" | "error">(
    "normal",
  );
  const [statusMessage, setStatusMessage] = useState("Monitoring Active");

  // Register screenshot provider for the heartbeat manager
  useEffect(() => {
    if (registerScreenshotProvider) {
      registerScreenshotProvider(() => {
        if (webcamRef.current) {
          return webcamRef.current.getScreenshot();
        }
        return null;
      });
    }
  }, [registerScreenshotProvider]);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face-api models", error);
      }
    };
    loadModels();
  }, []);

  const handleDetection = useCallback(async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      webcamRef.current.video.videoWidth > 0 &&
      modelsLoaded
    ) {
      try {
        const video = webcamRef.current.video;
        let detections;
        try {
          detections = await faceapi
            .detectAllFaces(
              video,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }),
            )
            .withFaceLandmarks();
        } catch {
          setStatus("error");
          setStatusMessage("FACE DETECTION ERROR");
          return;
        }

        if (!detections || detections.length === 0) {
          setStatus("error");
          setStatusMessage("NO FACE DETECTED");
          violationCountRef.current.noFace += 1;
          if (reportViolation) {
            reportViolation("NO_FACE");
          }
          if (violationCountRef.current.noFace % 10 === 0) {
            toast.error(
              "FACE NOT DETECTED: Please stay in front of the camera.",
            );
          }
        } else if (detections.length > 1) {
          setStatus("error");
          setStatusMessage("MULTIPLE FACES DETECTED");
          violationCountRef.current.multiFace += 1;
          if (reportViolation) {
            reportViolation("MULTI_FACE", { count: detections.length });
          }
          if (violationCountRef.current.multiFace % 5 === 0) {
            toast.error(
              "MULTIPLE FACES DETECTED: This is a strictly proctored exam.",
            );
          }
        } else {
          const detection = detections[0];
          const box = detection.detection.box;
          if (
            !box ||
            box.x === null ||
            box.y === null ||
            box.width === null ||
            box.height === null ||
            typeof box.x !== "number" ||
            typeof box.y !== "number" ||
            typeof box.width !== "number" ||
            typeof box.height !== "number"
          ) {
            setStatus("error");
            setStatusMessage("FACE DETECTION ERROR");
            return;
          }

          const landmarks = detection.landmarks;
          const nose = landmarks.getNose();
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          const eyeCenter = (leftEye[0].x + rightEye[3].x) / 2;
          const noseX = nose[0].x;
          const offset = Math.abs(noseX - eyeCenter);

          if (offset > 25) {
            setStatus("warning");
            setStatusMessage("ATTENTION LAPSE");
            violationCountRef.current.lookingAway += 1;
            if (reportViolation) {
              reportViolation("ATTENTION_LAPSE", { offset });
            }
            if (violationCountRef.current.lookingAway % 15 === 0) {
              toast.warn("Please keep your eyes on the screen.");
            }
          } else {
            setStatus("normal");
            setStatusMessage("Monitoring Active");
          }
        }
      } catch (error) {
        console.error("Face detection error:", error);
        // Don't toast here to avoid spamming the user if it's a transient error
      }
    }
  }, [modelsLoaded, reportViolation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modelsLoaded) {
      interval = setInterval(handleDetection, 1000); // Check every second
    }
    return () => clearInterval(interval);
  }, [modelsLoaded, handleDetection]);

  return (
    <div className="fixed bottom-6 left-6 z-60 group">
      <div
        className={clsx(
          "relative rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-2xl w-40 h-40 md:w-48 md:h-48",
          status === "normal"
            ? "border-green-500 shadow-green-500/20"
            : status === "warning"
              ? "border-yellow-500 shadow-yellow-500/20"
              : "border-red-500 shadow-red-500/20 animate-pulse",
        )}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="object-cover w-full h-full grayscale"
          videoConstraints={{
            width: 200,
            height: 200,
            facingMode: "user",
          }}
        />

        {/* Status Overlay */}
        <div
          className={clsx(
            "absolute top-0 left-0 right-0 py-1 px-2 text-[8px] font-black uppercase tracking-widest text-center text-white",
            status === "normal"
              ? "bg-green-500"
              : status === "warning"
                ? "bg-yellow-500"
                : "bg-red-500",
          )}
        >
          {statusMessage}
        </div>

        {/* Loading State */}
        {!modelsLoaded && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-[8px] font-black uppercase">
              Loading AI...
            </span>
          </div>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-[10px] py-2 px-4 rounded-xl font-bold whitespace-nowrap shadow-xl">
          AI-Powered Proctoring Active
        </div>
      </div>
    </div>
  );
};

export default FaceProctor;

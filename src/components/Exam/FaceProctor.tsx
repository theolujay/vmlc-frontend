/** @jsxImportSource react */
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
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
          return;
        }

        if (!detections || detections.length === 0) {
          violationCountRef.current.noFace += 1;
          if (reportViolation) {
            reportViolation("NO_FACE");
          }
        } else if (detections.length > 1) {
          violationCountRef.current.multiFace += 1;
          if (reportViolation) {
            reportViolation("MULTI_FACE", { count: detections.length });
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
            violationCountRef.current.lookingAway += 1;
            if (reportViolation) {
              reportViolation("ATTENTION_LAPSE", { offset });
            }
          }
        }
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }
  }, [modelsLoaded, reportViolation]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modelsLoaded) {
      interval = setInterval(handleDetection, 1000);
    }
    return () => clearInterval(interval);
  }, [modelsLoaded, handleDetection]);

  return (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      style={{ display: "none" }}
      videoConstraints={{
        width: 200,
        height: 200,
        facingMode: "user",
      }}
    />
  );
};

export default FaceProctor;

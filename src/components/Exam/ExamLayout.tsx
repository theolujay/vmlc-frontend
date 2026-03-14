import ExamNavigationProvider from "@/contexts/ExamNavigationProvider";
import React from "react";
import Header from "../General/Layout/Header";
import HeaderTimer from "./HeaderTimer";
import FaceProctor from "./FaceProctor";
import { ViolationType } from "@/types/ViolationType";

export default function ExamLayout({
  children,
  timer,
  deadline,
  onTimeUp,
  title,
  reportViolation,
  registerScreenshotProvider,
  examId,
}: Readonly<{
  children: React.ReactNode;
  timer: number;
  deadline?: string;
  onTimeUp: () => void;
  title?: string;
  reportViolation?: (
    type: ViolationType,
    metadata?: Record<string, unknown>,
  ) => void;
  registerScreenshotProvider?: (fn: () => string | null) => void;
  examId: string;
}>) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#F7F9FC]">
      <ExamNavigationProvider>
        <div className="sticky top-0 z-40">
          <Header />
          <HeaderTimer
            examId={examId}
            onTimeUp={onTimeUp}
            timer={timer}
            deadline={deadline}
            title={title}
          />
        </div>
        <main className="flex-1 py-10 relative">
          <div className="max-w-350 w-[95%] mx-auto">{children}</div>
          <FaceProctor
            reportViolation={reportViolation}
            registerScreenshotProvider={registerScreenshotProvider}
          />
        </main>
      </ExamNavigationProvider>
    </div>
  );
}

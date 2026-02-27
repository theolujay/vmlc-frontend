"use client"
import { useExamContext } from "@/contexts/ExamNavigationProvider"
import { formatExamTitle } from "@/utils/generalUtils"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import clsx from 'clsx'

export default function HeaderTimer({
  timer,
  deadline,
  onTimeUp,
  title
}: {
  timer: number
  deadline?: string
  onTimeUp?: () => Promise<void> | void
  title?: string
}) {
  const router = useRouter()
  const { showNav, setShowNav, timeLeft, setTimeLeft } = useExamContext()

  const calculateInitialTime = useCallback(() => {
    if (deadline) {
      const remaining = Math.floor((new Date(deadline).getTime() - new Date().getTime()) / 1000);
      return Math.max(0, remaining);
    }
    return timer * 60;
  }, [timer, deadline]);

  const hasSubmitted = useRef(false)

  useEffect(() => {
    setTimeLeft(calculateInitialTime());
  }, [calculateInitialTime, setTimeLeft])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)

          if (!hasSubmitted.current) {
            hasSubmitted.current = true;
            (async () => {
              try {
                await onTimeUp?.()
              } catch (err) {
                console.error("Error submitting exam:", err)
              }
            })()
          }

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onTimeUp, router, setTimeLeft])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0")
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
    const s = Math.floor(seconds % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  const isLowTime = timeLeft < 300 // 5 minutes

  return (
    <div className='flex bg-white justify-between px-10 py-6 items-center border-b border-gray-100 z-40 shadow-sm'>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
          <i className="fas fa-graduation-cap text-lg"></i>
        </div>
        <div className="flex flex-col">
          <h2 className='text-xl font-black text-gray-800 tracking-tight leading-none'>{formatExamTitle(title) || 'Examination Session'}</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verboheit MLC Portal</span>
        </div>
      </div>

      <div className={clsx(
        "flex flex-col items-center px-6 py-2 rounded-2xl border transition-all duration-500",
        isLowTime ? "bg-red-50 border-red-100 animate-pulse" : "bg-gray-50/50 border-gray-100"
      )}>
        <span className={clsx(
          "text-[9px] font-black uppercase tracking-widest mb-0.5",
          isLowTime ? "text-red-500" : "text-gray-400"
        )}>Time Remaining</span>
        <span className={clsx(
          "font-black text-xl tabular-nums tracking-tighter leading-none",
          isLowTime ? "text-red-600" : "text-[#3E4095]"
        )}>{formatTime(timeLeft)}</span>
      </div>

      <div className='flex gap-4 items-center'>
        <button
          onClick={() => setShowNav(!showNav)}
          className={clsx(
            "flex items-center space-x-3 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border",
            showNav
              ? "bg-[#3E4095] text-white border-[#3E4095] shadow-lg shadow-[#3E4095]/20"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          )}
        >
          <i className={clsx("fas transition-transform duration-300", showNav ? "fa-times" : "fa-th-large")}></i>
          <span>Quiz Navigation</span>
        </button>
      </div>
    </div>
  )
}

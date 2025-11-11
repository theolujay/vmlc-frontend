


"use client"

import { useExamContext } from "@/contexts/ExamNavigationProvider"
import { useEffect, useState } from "react"

export default function HeaderTimer({
  timer,
  onTimeUp,
}: {
  timer: number
  onTimeUp?: () => void
}) {
  const { showNav, setShowNav } = useExamContext()
  const [timeLeft, setTimeLeft] = useState<number>(timer * 60)

  useEffect(() => {
    setTimeLeft(timer * 60) 
  }, [timer])

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0")
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")
    const s = Math.floor(seconds % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  return (
    <div className='flex bg-white justify-between px-6 items-center'>
      <h2 className='text-[1.75rem] font-normal'>Screening Exam</h2>
      <div className='flex flex-col'>
        <span className='text-sm text-[#667185]'>Time Remaining</span>
        <span className='font-bold text-lg'>{formatTime(timeLeft)}</span>
      </div>

      <div className='flex gap-2 items-center'>
        <span>QUIZ NAVIGATION</span>
        <button
          onClick={() => setShowNav(!showNav)}
          aria-label='Toggle menu'
          className='flex flex-col gap-1 w-6 cursor-pointer focus:outline-none'
        >
          <span
            className={`h-0.5 w-full bg-black rounded-md transform transition duration-300 ${
              showNav ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-black rounded-md transition duration-300 ${
              showNav ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-black rounded-md transform transition duration-300 ${
              showNav ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </div>
    </div>
  )
}

import clsx from 'clsx'
import React, { useEffect } from 'react'

export default function Drawer({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto' // cleanup
    }
  }, [open])

  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 w-full h-screen bg-black/30 backdrop-blur-sm'>
      <div className={clsx("fixed  bg-white overflow-y-auto right-0 w-5/12 px-5 py-2 flex flex-col h-full")}>
        {children}
      </div>
    </div>
  )
}

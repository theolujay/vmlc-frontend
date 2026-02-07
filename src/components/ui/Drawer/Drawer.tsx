import clsx from 'clsx'
import React, { useEffect } from 'react'

export default function Drawer({ open, onClose, children }: { open: boolean, onClose: (open:boolean) => void, children: React.ReactNode }) {
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
    <div onClick={()=>onClose(false)} className='fixed inset-0 z-50 w-full h-screen bg-black/40 backdrop-blur-[2px] transition-opacity duration-300'>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={clsx("fixed bg-white overflow-y-auto right-0 w-[92%] sm:w-10/12 md:w-7/12 lg:w-5/12 xl:w-4/12 px-6 py-8 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 ease-out border-l border-gray-100")}
      >
        {children}
      </div>
    </div>
  )
}

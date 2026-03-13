import React from 'react'

export default function Footer() {
  return (
    <footer className='flex py-4 px-6 bg-white border-t border-gray-100 items-center justify-center'>
        <span className="text-[10px] font-bold text-gray-400 tracking-widest font-sans">
            &copy; {new Date().getFullYear()} Verboheit Consulting
        </span>
    </footer>
  )
}
"use client"
import React from 'react'

export default function AuthButton({children}:Readonly<{children:React.ReactNode}>) {
  return (
    <button onClick={()=>alert('I was clicked oo')} className='text-white cursor-pointer bg-grey-base-400 py-2 font-bold uppercase rounded-[8px]'>{children}</button>
  )
}

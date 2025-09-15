"use client"
import clsx from 'clsx'
import React from 'react'

export default function AuthButton({children,onClick}:Readonly<{children:React.ReactNode,onClick?:()=>void}>) {
  return (
    <button onClick={onClick} className={clsx('text-white cursor-pointer bg-grey-base-400 py-2 font-bold uppercase rounded-[8px]')}>{children}</button>
  )
}

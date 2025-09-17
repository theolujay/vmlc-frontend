"use client"
import clsx from 'clsx'
import React from 'react'

export default function Button({children,onClick,className}:Readonly<{children:React.ReactNode,onClick?:()=>void,className?:string}>) {
  return (
    <button onClick={onClick} className={clsx('text-white cursor-pointer bg-grey-base-400 py-2 font-bold uppercase rounded-[8px]',className)}>{children}</button>
  )
}

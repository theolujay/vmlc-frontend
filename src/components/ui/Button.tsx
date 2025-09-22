"use client"
import clsx from 'clsx'
import React from 'react'

export default function Button({children,onClick,className='bg-grey-base-400 text-white'}:Readonly<{children:React.ReactNode,onClick?:()=>void,className?:string}>) {
  return (
    <button onClick={onClick} className={clsx(' cursor-pointer py-2 font-bold uppercase rounded-[8px]',className)}>{children}</button>
  )
}

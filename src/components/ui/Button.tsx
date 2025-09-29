"use client"
import clsx from 'clsx'
import React from 'react'

export default function Button({children,onClick,className='bg-grey-base-400 ',isPending=false}:Readonly<{isPending?:boolean,children:React.ReactNode,onClick?:()=>void,className?:string}>) {
  return (
    <button onClick={onClick} disabled={isPending} className={clsx(' cursor-pointer text-white py-2 font-bold uppercase rounded-[8px]',className)}>{children}</button>
  )
}

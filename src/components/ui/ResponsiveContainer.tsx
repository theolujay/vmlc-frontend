import clsx from 'clsx'
import React from 'react'

export default function ResponsiveContainer({className,children}:Readonly<{className?:string,children:React.ReactNode}>) {
  return (
    <div className={clsx(className,'rounded-[24px] bg-white shadow-sm w-full border border-[#E4E7EC] flex flex-col p-3')}>{children}</div>
  )
}

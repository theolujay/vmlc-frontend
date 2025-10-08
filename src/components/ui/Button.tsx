// "use client"
// import clsx from 'clsx'
// import React from 'react'

// export default function Button({children,onClick,className='bg-grey-base-400 ',isPending=false,disabled=false}:Readonly<{isPending?:boolean,children:React.ReactNode,onClick?:()=>void,className?:string,disabled?:boolean}>) {
//   return (
//     <button onClick={onClick} disabled={disabled} className={clsx(' cursor-pointer text-white py-2 font-bold uppercase rounded-[8px]',className,isPending?'bg-grey-base-400':'bg-[#3E4095]', disabled
//           ? 'bg-grey-base-400 cursor-not-allowed'
//           : 'bg-[#3E4095] hover:bg-[#2d2f6e]',)}>{children}</button>
//   )
// }


"use client"
import clsx from 'clsx'
import React from 'react'

export default function Button({
  children,
  onClick,
  className = '',
  isPending = false,
  disabled = false,
}: Readonly<{
  isPending?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isPending}
      className={clsx(
        'cursor-pointer text-white py-2 font-bold uppercase rounded-[8px] transition-colors duration-200',
        className,
        (disabled || isPending)
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-[#3E4095] hover:bg-[#2d2f6e]'
      )}
    >
      {children}
    </button>
  )
}

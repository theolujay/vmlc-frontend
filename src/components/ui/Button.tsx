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
  // invite,
  pendingState= 'bg-[#3E4095] hover:bg-[#2d2f6e]',
  onClick,
  className = '',
  isPending = false,
  disabled = false,
}: Readonly<{
  // invite?:string
  isPending?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  pendingState?:string
}>) {
  return (
    <button
    // form={invite}
      onClick={onClick}
      disabled={disabled || isPending}
      className={clsx(
        'cursor-pointer text-white py-2 font-bold uppercase rounded-lg transition-colors duration-200',
        className,
        (disabled || isPending)
          ? 'bg-gray-400 cursor-not-allowed'
          :pendingState
          // : 'bg-[#3E4095] hover:bg-[#2d2f6e]'
      )}
    >
      {children}
    </button>
  )
}





export function ExportButton({
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
        'cursor-pointer inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 shadow-sm hover:bg-gray-50 active:scale-95',
        className,
        (disabled || isPending) && 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-70 shadow-none'
      )}
    >
      {children}
    </button>
  )
}


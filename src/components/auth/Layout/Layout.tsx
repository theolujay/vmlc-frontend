import React, { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function AuthLayout({children}:Readonly<{children:ReactNode}>) {
  return (
    <div className='flex bg-[#E2E2EF] w-full flex-col '>
      <Header/>
      <main className='min-h-[100vh]'>{children}</main>
      <Footer/>
    </div>
  )
}

"use client"
import React, { ReactNode, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter()
  const { authState } = useAuth()
  
  useEffect(() => {
    
    if (authState?.isAuthenticated) {
      // router.push('/get-started')
      router.push(authState.homePath ?? '/')
    }
  }, [authState])
  return (
    <div className='flex bg-[#E2E2EF] w-full flex-col '>
      <Header />
      <main className='min-h-[100vh]'>{children}</main>
      <Footer />
    </div>
  )
}

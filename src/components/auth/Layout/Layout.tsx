"use client"
import React, { ReactNode, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthProvider'
import Image from 'next/image'

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter()
  const { authState } = useAuth()
  
  useEffect(() => {
    if (authState?.isAuthenticated) {
      router.push(authState.homePath ?? '/')
    }
  }, [authState?.isAuthenticated, authState?.homePath, router])

  return (
    <div className='relative flex w-full bg-[#060612] flex-col min-h-screen overflow-hidden font-sans'>
      {/* Background Image with Overlay */}
      <div className="z-0 absolute inset-0 ">
        <Image
          src="/hero.png"
          alt="Past winners"
          fill
          priority
          className="object-cover opacity-10"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Header />
        <main className='flex-1 flex flex-col'>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}
"use client"
import Logo from '@/components/ui/SvgAsset/Logo'
import Link from 'next/link'
import React from 'react'
import config from '../../../../config'

const landingUrl = config.LANDING_URL

export default function Header() {
  return (
    <header className="relative flex bg-white backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="flex mx-auto justify-between items-center w-full max-w-7xl px-4 py-4 md:px-8">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <Logo className="h-8 md:h-10 w-auto" />
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link
            href={`${landingUrl}/#about`}
            className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-[#3E4095] transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
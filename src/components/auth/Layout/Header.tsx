"use client"
import Logo from '@/components/ui/SvgAsset/Logo'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Determine which page we're on
  const isOnCandidatePage = pathname === '/register'
  const isOnVolunteerPage = pathname === '/register/staff'
  
  return (
    <header className="relative flex bg-white px-6 items-center">
      <div className="flex mx-auto justify-between w-full py-4">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-between items-center gap-6">
          <Link
            href="https://www.verboheit.org/#about"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            About the Competition
          </Link>
          <Link
            href="https://www.verboheit.org/#stages"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Competition Stages
          </Link>
          
          {/* Show volunteer link when on candidate page */}
          {isOnCandidatePage && (
            <Link
              href="/register/staff"
              className="text-[#3E4095] p-3 font-semibold rounded-full bg-[#E2E2EF] hover:bg-[#D0D0E0] transition-colors"
            >
              Become a volunteer
            </Link>
          )}
          
          {/* Show candidate link when on volunteer page */}
          {isOnVolunteerPage && (
            <Link
              href="/register"
              className="text-[#3E4095] p-3 font-semibold rounded-full bg-[#E2E2EF] hover:bg-[#D0D0E0] transition-colors"
            >
              Register as candidate
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border rounded-md"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </div>
        </button>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md p-4 flex flex-col gap-4 md:hidden z-50">
          <Link
            href="https://www.verboheit.org/#about"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About the Competition
          </Link>
          <Link
            href="https://www.verboheit.org/#stages"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Competition Stages
          </Link>
          
          {/* Show volunteer link when on candidate page */}
          {isOnCandidatePage && (
            <Link
              href="/register/staff"
              className="text-[#3E4095] p-3 font-semibold rounded-full bg-[#E2E2EF] hover:bg-[#D0D0E0] transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Become a volunteer
            </Link>
          )}
          
          {/* Show candidate link when on volunteer page */}
          {isOnVolunteerPage && (
            <Link
              href="/register"
              className="text-[#3E4095] p-3 font-semibold rounded-full bg-[#E2E2EF] hover:bg-[#D0D0E0] transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Register as candidate
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
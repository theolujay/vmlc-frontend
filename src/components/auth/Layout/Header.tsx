// import Logo from '@/components/ui/SvgAsset/Logo'
// import Link from 'next/link'
// import React from 'react'

// export default function Header() {
//   return (
//     <header className='flex bg-white py-0 px-[24px]  items-center justify-center'>
//        <div className="flex mx-auto justify-between w-full py-4">
//         <Link href='/'>
//         <Logo/>
//         </Link>
//         <nav className='flex justify-between items-center gap-6'>
//           <Link href='/'>About the Competition</Link>
//           <Link href='/'>Competition Stages</Link>
//         </nav>
//         </div> 
//     </header>
//   )
// }
"use client"

import Logo from '@/components/ui/SvgAsset/Logo'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex bg-white px-6 items-center">
      <div className="flex mx-auto justify-between w-full py-4">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-between items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            About the Competition
          </Link>
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Competition Stages
          </Link>
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
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md p-4 flex flex-col gap-4 md:hidden">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About the Competition
          </Link>
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Competition Stages
          </Link>
        </div>
      )}
    </header>
  )
}

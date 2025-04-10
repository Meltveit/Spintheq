'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="w-full bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold">
                SpinTheQ
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-6 items-center">
              <Link href="/games/spin-the-bottle" className="px-3 py-2 hover:text-blue-200 transition-colors">
                Spin the Bottle
              </Link>
              <Link href="/games/truth-or-dare" className="px-3 py-2 hover:text-blue-200 transition-colors">
                Truth or Dare
              </Link>
              <Link href="/games/party-challenge" className="px-3 py-2 hover:text-blue-200 transition-colors">
                Party Challenges
              </Link>
              <Link href="/about" className="px-3 py-2 hover:text-blue-200 transition-colors">
                About
              </Link>
              <Link href="/more-games" className="px-3 py-2 hover:text-blue-200 transition-colors">
                More Games
              </Link>
            </nav>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu - simple hamburger */}
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon for close */}
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-blue-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/games/spin-the-bottle" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
            Spin the Bottle
          </Link>
          <Link href="/games/truth-or-dare" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
            Truth or Dare
          </Link>
          <Link href="/games/party-challenge" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
            Party Challenges
          </Link>
          <Link href="/about" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
            About
          </Link>
          <Link href="/more-games" className="block px-3 py-2 hover:bg-blue-700 rounded-md">
            More Games
          </Link>
        </div>
      </div>
    </header>
  );
}
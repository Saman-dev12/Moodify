"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 flex-wrap">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-lg font-bold text-white">
                <Link href="/" className="text-white hover:text-[#1DB954]">Moodify</Link>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 relative">
            {status === "authenticated" ? (
              <>
                <div className="flex-shrink-0">
                  <button onClick={toggleDropdown}>
                    {session?.user?.image && (
                      <img src={session.user.image} alt="User Avatar" className="h-10 w-10 rounded-full" />
                    )}
                  </button>
                </div>
                {isDropdownOpen && (
                  <div id="dropdown" className="absolute top-10 right-0 w-64 bg-[#2E2E2E] rounded-lg shadow-lg z-10 transition-transform transform scale-95 origin-top-right p-4">
                    <div className="block px-4 py-2 text-sm text-gray-300 font-semibold w-full text-left">Welcome back, {session?.user?.email}!</div>
                    
                    <Link href={`/${session?.user?.name?.split(' ')[0]}/saved`} className="block px-4 py-2 text-sm text-white bg-[#3A3A3A] hover:bg-[#4A4A4A] w-full text-left rounded-md transition duration-200 ease-in-out mt-2">
                      <span className="font-medium">Saved Playlists</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        router.push('/')
                      }}
                      className="block px-4 py-2 text-sm text-white bg-[#3A3A3A] hover:bg-[#4A4A4A] w-full text-left rounded-md transition duration-200 ease-in-out mt-1"
                    >
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/login"
                className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1DB954] hover:bg-[#1aa34a]"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

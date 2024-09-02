"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
            </div>
            <div className="ml-4">
              <div className="text-lg font-bold text-white">
                <Link href="/" className="text-white hover:text-white">Moodify
                </Link>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {session ? (
              <>
                <button
                  onClick={() => {signOut()
                    router.push('/')
                  }}
                  className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href={'/login'}
                  className="ml-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
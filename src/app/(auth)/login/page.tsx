"use client"
import React from 'react'

import { signIn } from 'next-auth/react';

function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => signIn('google')}
      >
        <div className="flex items-center">
          <p>Login with Google</p>
        </div>
      </button>
    </div>
  );
}

export default LoginPage
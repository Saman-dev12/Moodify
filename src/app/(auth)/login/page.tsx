"use client"
import React from 'react'
import { signIn } from 'next-auth/react';

function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-green-400 to-green-600">
      <h1 className="text-5xl font-extrabold text-white mb-10 animate-bounce">Login to Moodify</h1>
      <button
        className="bg-white hover:bg-gray-200 text-green-600 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        onClick={() => signIn('google')}
      >
        <div className="flex items-center">
          <img src="https://imgs.search.brave.com/V7sgagRATLlWoAL9kKkWlvM1Lymxxb-2sk6dz3LnYrk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2MxL0dvb2dsZV8l/MjJHJTIyX2xvZ28u/c3Zn" alt="Google Icon" className="h-6 w-6 mr-2" />
          <p className="text-lg">Sign in with Google</p>
        </div>
      </button>
      <button
        className="bg-white hover:bg-gray-200 text-green-600 font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 mt-4"
        onClick={() => signIn('spotify')}
      >
        <div className="flex items-center">
          <img src="https://imgs.search.brave.com/jdSgE6rbYbYNaAIotVL4SzlgSXXf9qKVcTTAlq9ylho/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy84/Lzg0L1Nwb3RpZnlf/aWNvbi5zdmc" alt="Spotify Icon" className="h-6 w-6 mr-2" />
          <p className="text-lg">Sign in with Spotify</p>
        </div>
      </button>
      <p className="mt-6 text-white text-sm">Create your personalized playlists and enjoy the music!</p>
    </div>
  );
}

export default LoginPage
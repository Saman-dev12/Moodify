"use client"
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import axios from 'axios';
import Image from 'next/image';

interface Song {
    id: string;
    title: string;
    image: string | null;
    album: string;
    url: string;
    primaryArtists: string;
    singers: string;
    language: string;
}

interface FormData {
    mood: string;
}

function DashboardPage() {
    const { data: session } = useSession();
    const [formData, setFormData] = useState<FormData>({
        mood: '',
    });
    const [playlist, setPlaylist] = useState<Song[]>([]);
    const [error, setError] = useState<string | null>(null); // State to handle errors
    const [customMood, setCustomMood] = useState<string>(''); // State for custom mood input
    const [isCustomMood, setIsCustomMood] = useState<boolean>(false); // State to track if custom mood is selected
    const [playingSong, setPlayingSong] = useState<string | null>(null); // State to track the currently playing song

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error state on new submission
        const moodToSubmit = isCustomMood ? customMood : formData.mood; // Use custom mood if selected
        try {
            const response = await axios.post('/api/getPlaylist', { mood: moodToSubmit });
    
            // Shuffle the playlist on each request
            const shuffledPlaylist = response.data.playlist.sort(() => Math.random() - 0.5);
            setPlaylist(shuffledPlaylist);
        } catch (error) {
            console.error('Error fetching playlist:', error);
            setError('Failed to fetch playlist. Please try again.'); // Set error message
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMood = e.target.value;
        setFormData({ ...formData, mood: selectedMood });
        setIsCustomMood(selectedMood === 'other'); // Check if 'other' option is selected
        if (selectedMood !== 'other') {
            setCustomMood(''); // Reset custom mood if a predefined option is selected
        }
    };

    const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomMood(e.target.value); // Update custom mood state
    };

    const handlePlaySong = (url: string) => {
        setPlayingSong(url); // Set the currently playing song
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-yellow-500 p-5">
            <h1 className="text-5xl font-extrabold text-white mb-8 animate-bounce">Moodify Your Playlist</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-md transform hover:scale-105 transition duration-300">
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-gray-700">Your Vibe</label>
                    <select id="mood" name="mood" value={formData.mood} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm">
                        <option value="">Select your groovy mood</option>
                        <option value="happy">😄 Ecstatic</option>
                        <option value="sad">😢 Blue</option>
                        <option value="energetic">⚡ Supercharged</option>
                        <option value="relaxed">😌 Chilled Out</option>
                        <option value="excited">🎉 Excited</option>
                        <option value="calm">🌊 Calm</option>
                        <option value="thoughtful">🤔 Thoughtful</option>
                        <option value="nostalgic">🕰️ Nostalgic</option>
                        <option value="other">📝 Other</option> {/* New option for custom mood */}
                    </select>
                    {isCustomMood && ( // Show input for custom mood if 'other' is selected
                        <input
                            type="text"
                            value={customMood}
                            onChange={handleCustomMoodChange}
                            placeholder="Enter your mood"
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                            required
                        />
                    )}
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition duration-300">
                    Get Your Groovy Playlist
                </button>
            </form>

            {playlist.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-gray-800">Your Funky Playlist</h2>
                    <ul className="mt-4 space-y-4">
                        {playlist.map((song) => (
                            <li key={song.id} className="flex items-center space-x-4">
                                <div>
                                    <p className="font-semibold">{song.title}</p>
                                    <p className="text-sm text-gray-600">{song.primaryArtists}</p>
                                    <audio controls className="mt-2" onError={() => setError('Error playing audio. Please check the file.')} onPlay={() => handlePlaySong(song.url)}>
                                        <source src={song.url} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default DashboardPage
"use client";
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import axios from 'axios';

interface Song {
    id: string;
    name: string;
    album: string;
    url: string;
    artists: string;
}

function DashboardPage() {
    const { data: session } = useSession(); // Use session if you need user authentication
    const [mood, setMood] = useState<string>('');
    const [customMood, setCustomMood] = useState<string>(''); // State for custom mood input
    const [playlistData, setPlaylistData] = useState<Song[] | null>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCustomMood, setIsCustomMood] = useState(false); // State to track if custom mood is selected
    const [showPlaylist, setShowPlaylist] = useState(false); // State to control playlist visibility
    const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index of songs to display
    const [loading, setLoading] = useState(false); // State to track loading status
    const songsPerPage = 5; // Number of songs to display per page

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setPlaylistData(null); // Reset previous playlist data
        setShowPlaylist(false); // Hide playlist initially
        setCurrentIndex(0); // Reset current index when fetching new playlist
        setLoading(true); // Set loading to true

        try {
            const response = await axios.post('/api/getPlaylist', { mood: isCustomMood ? customMood : mood });
            if (response.data && response.data.tracks) {
                setPlaylistData(response.data.tracks);
                setShowPlaylist(true); // Show playlist after fetching data
            } else {
                setError('No songs found for the given mood.');
            }
        } catch (error) {
            console.error('Error fetching song:', error);
            setError('Failed to fetch song. Please try again.');
        } finally {
            setLoading(false); // Set loading to false after the request is complete
        }
    };

    const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMood = e.target.value;
        setMood(selectedMood);
        setIsCustomMood(selectedMood === 'other'); // Check if 'other' is selected
        if (selectedMood !== 'other') {
            setCustomMood(''); // Reset custom mood if a predefined mood is selected
        }
    };

    const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomMood(e.target.value);
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    const handleNextSongs = () => {
        if (playlistData) {
            setCurrentIndex((prevIndex) => Math.min(prevIndex + songsPerPage, playlistData.length));
        }
    };

    const displayedSongs = playlistData ? playlistData.slice(currentIndex, currentIndex + songsPerPage) : [];

    return (
        <div className="flex flex-col items-center min-h-screen bg-black p-5">
            <h1 className="text-5xl font-extrabold text-white mb-8">Moodify Your Playlist</h1>
            <form onSubmit={handleSubmit} className="bg-[#1DB954] p-8 rounded-lg shadow-lg space-y-6 w-full max-w-md transform hover:scale-105 transition duration-300">
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-white">Select Your Mood</label>
                    <select
                        value={mood}
                        id='mood'
                        onChange={handleMoodChange}
                        className="bg-gray-800 text-white block w-full rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-[#1DB954] focus:border-[#1DB954] sm:text-sm p-2"
                        required
                    >
                        <option value="" disabled>-- Select a mood --</option>
                        <option value="happy">😊 Happy</option>
                        <option value="sad">😢 Sad</option>
                        <option value="energetic">⚡ Energetic</option>
                        <option value="relaxed">😌 Relaxed</option>
                        <option value="other">🤔 Other</option>
                    </select>
                </div>
                {isCustomMood && (
                    <div>
                        <label htmlFor="customMood" className="block text-sm font-medium text-white">Enter Custom Mood</label>
                        <input
                            type="text"
                            id='customMood'
                            value={customMood}
                            onChange={handleCustomMoodChange}
                            placeholder="Enter your mood"
                            className="mt-2 block w-full rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-[#1DB954] focus:border-[#1DB954] sm:text-sm p-2"
                            required
                        />
                    </div>
                )}
                <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transform hover:scale-105 transition duration-300">
                    Get Your Groovy Song
                </button>
            </form>

            {loading && (
                <div className="mt-4 p-4 bg-black rounded shadow-md flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1DB954] mb-3"></div>
                    <p className="text-white text-lg">Loading your playlist...</p>
                    <p className="text-gray-400">Please wait a moment while we find the perfect songs for you!</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {showPlaylist && playlistData && (
                <div className="mt-8 bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-semibold text-white mb-4">Your Mood Song</h2>
                    <div className="space-y-4">
                        {displayedSongs.map((song) => (
                            <div key={song.id}>
                                <p className="font-semibold text-lg text-white">{song.name}</p>
                                <p className="text-sm text-gray-400">Album: {song.album}</p>
                                <p className="text-sm text-gray-400">Artists: {song.artists}</p>
                                <a href={song.url} className="text-[#1DB954] hover:underline" target="_blank" rel="noopener noreferrer">Listen on Spotify</a>
                            </div>
                        ))}
                    </div>
                    {currentIndex + songsPerPage < playlistData.length && (
                        <button onClick={handleNextSongs} className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1DB954] hover:bg-[#1aa34a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transform hover:scale-105 transition duration-300">
                            Show More Songs
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;

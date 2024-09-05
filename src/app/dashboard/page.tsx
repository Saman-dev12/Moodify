"use client";
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import axios from 'axios';
import Modal from '~/components/Modal';
import { Music, Loader2, AlertCircle, PlusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPlaylist } from '~/actions';

interface Song {
    id: string;
    name: string;
    album: string;
    url: string;
    artists: string;
}

function DashboardPage() {
    const { data: session } = useSession();
    const [mood, setMood] = useState<string>('');
    const [customMood, setCustomMood] = useState<string>('');
    const [playlistData, setPlaylistData] = useState<Song[] | null>([]);
    const [error, setError] = useState<string | null>(null);
    const [isCustomMood, setIsCustomMood] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [playlistName, setPlaylistName] = useState<string>('');
    const songsPerPage = 5;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setPlaylistData(null);
        setShowPlaylist(false);
        setCurrentIndex(0);
        setLoading(true);

        try {
            const response = await axios.post('/api/getPlaylist', { mood: isCustomMood ? customMood : mood });
            if (response.data && response.data.tracks) {
                setPlaylistData(response.data.tracks);
                setShowPlaylist(true);
            } else {
                setError('No songs found for the given mood.');
            }
        } catch (error) {
            console.error('Error fetching song:', error);
            setError('Failed to fetch song. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMood = e.target.value;
        setMood(selectedMood);
        setIsCustomMood(selectedMood === 'other');
        if (selectedMood !== 'other') {
            setCustomMood('');
        }
    };

    const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomMood(e.target.value);
    };

    const handlePlaylistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(e.target.value);
    };

    const displayedSongs = playlistData ? playlistData.slice(currentIndex, currentIndex + songsPerPage) : [];

    function handleAddToPlaylist(id: string): void {
        console.log(id);
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center min-h-screen bg-gradient-to-b from-black to-gray-900 p-5"
        >
            <div className="w-full flex justify-end">
                <Modal
                    trigger={
                        <button className="bg-gradient-to-r from-[#1DB954] to-[#2acf64] flex items-center text-white px-6 py-3 rounded-full hover:from-[#1ed760] hover:to-[#1DB954] transition-transform transform hover:scale-105 duration-300 shadow-lg">
                            <PlusIcon className="mr-2"/> 
                            <span className="font-semibold">Create Playlist</span>
                        </button>
                    }
                    title="Create New Playlist"
                    icon={<Music size={24} />}
                    content={
                        <div>
                            <label htmlFor="playlistName" className="block text-sm font-medium text-white mb-2">Playlist Name</label>
                            <input
                                type="text"
                                id="playlistName"
                                value={playlistName}
                                onChange={handlePlaylistNameChange}
                                className="w-full p-2 bg-[#282828] text-white rounded-md border border-[#484848] focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                                placeholder="Enter playlist name"
                            />
                        </div>
                    }
                    onSave={() => {
                        createPlaylist(playlistName);
                    }}
                    saveButtonText="Create Playlist"
                />
            </div>
            <motion.h1 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-5xl font-extrabold text-white mb-8 text-center"
            >
                Moodify Your Playlist
            </motion.h1>
            <motion.form 
                onSubmit={handleSubmit}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] p-8 rounded-lg shadow-lg space-y-6 w-full max-w-md transform hover:scale-105 transition duration-300"
            >
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-white">Select Your Mood</label>
                    <select
                        value={mood}
                        id='mood'
                        onChange={handleMoodChange}
                        className="bg-gray-800 text-white block w-full rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-[#1DB954] focus:border-[#1DB954] sm:text-sm p-2 mt-1"
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
                <AnimatePresence>
                    {isCustomMood && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label htmlFor="customMood" className="block text-sm font-medium text-white">Enter Custom Mood</label>
                            <input
                                type="text"
                                id='customMood'
                                value={customMood}
                                onChange={handleCustomMoodChange}
                                placeholder="Enter your mood"
                                className="mt-1 block w-full rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-[#1DB954] focus:border-[#1DB954] sm:text-sm p-2 bg-gray-800 text-white"
                                required
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transition duration-300"
                >
                    <Music className="mr-2" size={18} />
                    Get Your Groovy Song
                </motion.button>
            </motion.form>

            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 p-4 bg-black rounded shadow-md flex flex-col items-center"
                    >
                        <Loader2 className="animate-spin h-16 w-16 text-[#1DB954] mb-3" />
                        <p className="text-white text-lg">Loading your playlist...</p>
                        <p className="text-gray-400">Please wait a moment while we find the perfect songs for you!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center"
                    >
                        <AlertCircle className="mr-2" size={18} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPlaylist && playlistData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 bg-[#1E1E1E] p-6 rounded-lg shadow-lg w-full max-w-md"
                    >
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Mood Songs</h2>
                        <div className="space-y-4">
                            {displayedSongs.map((song, index) => (
                                <motion.div 
                                    key={song.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                                >
                                    <div className="flex-1 mr-4">
                                        <p className="font-semibold text-lg text-white truncate" title={song.name}>
                                            {song.name.length > 30 ? `${song.name.substring(0, 30)}...` : song.name}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate" title={song.album}>
                                            {song.album.length > 30 ? `${song.album.substring(0, 30)}...` : song.album}
                                        </p>
                                        <p className="text-sm text-gray-400 truncate" title={song.artists}>
                                            {song.artists.length > 30 ? `${song.artists.substring(0, 30)}...` : song.artists}
                                        </p>
                                        <a 
                                            onClick={() => window.open(song.url, '_blank')}
                                            className="text-[#1DB954] hover:underline cursor-pointer text-sm"
                                        >
                                            Listen on Spotify
                                        </a>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddToPlaylist(song.id)}
                                        className="inline-flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1DB954] hover:bg-[#1aa34a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DB954] transition duration-300"
                                    >
                                        Add
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default DashboardPage;

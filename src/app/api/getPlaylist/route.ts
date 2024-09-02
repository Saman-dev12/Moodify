import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface Song {
    id: string;
    title: string;
    image: (string | null)[];
    album: string;
    url: string;
    type: string;
    description: string;
    primaryArtists: string;
    singers: string;
    language: string;
}

const getJioSaavnPlaylist = async (mood: string) => {
    const options = {
        method: 'GET',
        url: 'https://saavn.dev/api/search',
        params: { query: mood }
    };

    try {
        const { data } = await axios.request(options);
        if (data.success && data.data.songs && data.data.songs.results) {
            const songs = data.data.songs.results.map((song: Song) => ({
                id: song.id,
                title: song.title,
                image: song.image[0] || null,
                album: song.album,
                url: song.url,
                primaryArtists: song.primaryArtists,
                singers: song.singers,
                language: song.language
            }));
            // Shuffle the songs array
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            return songs;
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching JioSaavn playlist:', error);
        throw error;
    }
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { mood } = body;

    if (!mood) {
        return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    try {
        const playlist = await getJioSaavnPlaylist(mood);
        // Shuffle the playlist on each request
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        // Select a random subset of 10 songs
        const randomSubset = playlist.slice(0, 10);
        return NextResponse.json({ playlist: randomSubset });
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return NextResponse.json({ error: 'Failed to retrieve playlist' }, { status: 500 });
    }
}

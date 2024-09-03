import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface SpotifySearchResponse {
    playlists: {
        href: string;
        items: {
            id: string;
            name: string;
            external_urls: {
                spotify: string;
            };
            images: { url: string; height: number; width: number }[];
            tracks: {
                href: string;
                total: number;
            };
            owner: {
                display_name: string;
            };
            type: string;
        }[];
    };
}

interface SpotifyPlaylistResponse {
    tracks: {
        items: {
            track: {
                id: string;
                name: string;
                artists: { name: string }[];
                album: { name: string };
                external_urls: { spotify: string };
            };
        }[];
    };
}

const getSpotifyPlaylists = async (mood: string) => {
    const accessToken = await getSpotifyAccessToken();

    const options = {
        method: 'GET',
        url: 'https://api.spotify.com/v1/search',
        params: {
            q: mood,
            type: 'playlist',
            limit: 5 // Fetch multiple playlists
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const { data } = await axios.request<SpotifySearchResponse>(options);
        if (data.playlists?.items?.length > 0) {
            const allTracks = [];

            // Fetch details for each playlist
            for (const playlist of data.playlists.items) {
                const playlistResponse = await axios.get<SpotifyPlaylistResponse>(
                    `https://api.spotify.com/v1/playlists/${playlist.id}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                // Limit the number of tracks returned from each playlist
                const tracks = playlistResponse.data.tracks.items.slice(0, 5).map(item => ({
                    id: item.track.id,
                    name: item.track.name,
                    artists: item.track.artists.map(artist => artist.name).join(', '),
                    album: item.track.album.name,
                    url: item.track.external_urls.spotify,
                }));

                allTracks.push(...tracks); // Combine tracks from all playlists
            }
            
            return allTracks;
        } else {
            throw new Error('No playlists found or invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching Spotify playlists:', error);
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
        const tracks = await getSpotifyPlaylists(mood);
        return NextResponse.json({ tracks });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return NextResponse.json({ error: 'Failed to retrieve playlists' }, { status: 500 });
    }
}

const getSpotifyAccessToken = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'client_credentials'
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            }
        });
        
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error;
    }
};

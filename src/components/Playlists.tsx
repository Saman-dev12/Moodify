"use client"
import React, { useState } from "react";
import Modal from "./Modal";

interface Playlist {
  id: number;
  name: string;
  userId: number;
  songs: Song[];
}

interface Song{
  id: number;
  name: string;
  artist: string;
  url: string;
  playlistId: number;
}

function Playlists({ playlist }: { playlist: Playlist }) {
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    // Handle save changes if needed
  };

  return (
    <div>
      <Modal
        trigger={
          <li
            className="bg-[#2E2E2E] p-4 rounded-lg shadow-md hover:bg-[#1DB954] transition duration-200 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            {playlist.name}
          </li>
        }
        title={playlist.name}
        content={
          <ul>
            {playlist.songs.map((song: Song, index: number) => (
              <li key={index} className="p-2 border-b border-gray-700">
                <span>{song.name} by {song.artist}</span>
              </li>
            ))}
          </ul>
        }
        onSave={handleSave}
        saveButtonText="Update"
      />
    </div>
  );
}

export default Playlists;

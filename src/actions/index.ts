"use server";

import { getServerAuthSession } from "~/server/auth";
import prisma from "~/utils/Prisma";

export async function createPlaylist(name: string) {
    if (!name) {
        throw new Error("Playlist name is required");
    }
    
    const session = await getServerAuthSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("User not authenticated");
    }

    const userId = +session.user.id;

    // Check if a playlist with the same name exists for this user
    const existingPlaylist = await prisma.playlist.findFirst({
        where: {
            name: name,
            userId: userId,
        },
    });

    if (existingPlaylist) {
        console.log("Playlist exists");
        return;
    }

    // Create a new playlist if no duplicate is found
    const newPlaylist = await prisma.playlist.create({
        data: {
            name: name,
            userId: userId,
        },
    });

    return newPlaylist;
}

"use server";

import { getServerAuthSession } from "~/server/auth";
import prisma from "~/utils/Prisma";

export async function createPlaylist(name: string) {
    if (!name) {
        return;
    }
    const session = await getServerAuthSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("User not authenticated");
    }
    const newPlaylist = await prisma.playlist.create({
        data: {
            name: name,
            userId: +session.user.id,
        },
    });
    return newPlaylist;
}
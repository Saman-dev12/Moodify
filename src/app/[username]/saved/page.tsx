import { getServerSession } from "next-auth";
import Playlists from "~/components/Playlists";
import prisma from "~/utils/Prisma";

export default async function Page() {
  const session = await getServerSession();
  const savedPlaylists = await prisma.playlist.findMany({
    where: {
      userId: {
        equals: session?.user?.id ? +session.user.id : undefined
      },
    },
    include:{
        songs:true,
    }
  }) || [];
  console.log(savedPlaylists);
  
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-[#1DB954]">Saved Playlists</h1>
      <ul className="space-y-4 w-full max-w-2xl">
        {savedPlaylists.map((playlist) => (
          <Playlists key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
}

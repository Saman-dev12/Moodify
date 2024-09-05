import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-pulse">Welcome to Moodify</h1>
      <p className="text-xl text-white mb-6 text-center max-w-md">
        Discover your ultimate music playlist generator tailored to your unique mood! Let the vibes flow.
      </p>
      <Link href="/dashboard">
        <button className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-full shadow-xl text-white bg-[#1DB954] hover:bg-[#1aa34a] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#1DB954] transform hover:scale-110 transition duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
}

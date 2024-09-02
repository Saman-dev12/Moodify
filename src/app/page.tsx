import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 p-8">
      <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">Welcome to Moodify</h1>
      <p className="text-xl text-white mb-6 text-center max-w-md">
        Discover your ultimate music playlist generator tailored to your unique mood! Let the vibes flow.
      </p>
      <Link href="/dashboard">
        <button className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105 transition duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
}

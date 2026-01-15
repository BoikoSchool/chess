import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-8">
      <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-700">
        BOIKO CHESS
      </h1>
      <div className="flex gap-6">
        <Link
          href="/admin"
          className="px-8 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          Admin Panel
        </Link>
        <Link
          href="/display"
          className="px-8 py-3 bg-gradient-to-br from-amber-600 to-yellow-600 text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-amber-900/20"
        >
          Display Mode (3D)
        </Link>
      </div>
    </main>
  );
}

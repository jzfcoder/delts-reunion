import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Delts Reunion 2026
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/itinerary" className="hover:text-purple-400 transition-colors">
            Itinerary
          </Link>
          <Link href="/signup" className="hover:text-purple-400 transition-colors">
            Sign Up
          </Link>
          <Link href="/guests" className="hover:text-purple-400 transition-colors">
            Guest List
          </Link>
          <Link href="/map" className="hover:text-purple-400 transition-colors">
            Map
          </Link>
          <Link href="/login" className="hover:text-purple-400 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}

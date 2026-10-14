import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[var(--ink)] px-6 text-[var(--cream)]">
    <section className="max-w-lg border border-white/20 bg-white/5 p-8 shadow-[12px_12px_0_var(--violet)] sm:p-12">
      <p className="font-mono text-xs tracking-[0.16em] text-[var(--sky)]">ERROR / 404</p>
      <h1 className="mt-6 font-display text-6xl font-semibold tracking-[-0.08em]">This path is still under the map.</h1>
      <p className="mt-5 leading-7 text-white/70">The level you were looking for isn&apos;t here yet. The rest of the world is still open.</p>
      <Link href="/" className="mt-8 inline-flex items-center gap-2 bg-[var(--sky)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-1">
        <ArrowLeft size={17} /> Return to world
      </Link>
    </section>
  </main>
}

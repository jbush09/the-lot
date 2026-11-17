import { useEffect } from "react"
import { Link, useRouterState } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { PlayerBar } from "@/components/lot/player-bar"
import { hydrateLot, useLot } from "@/lib/lot/store"
import { getPlayer } from "@/lib/lot/player"
import { cn } from "@/lib/utils"

const TABS = [
  { to: "/", label: "Wall" },
  { to: "/browse", label: "Browse" },
  { to: "/drop", label: "Drop" },
  { to: "/phone", label: "Phone" },
] as const

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname })
  const offline = useLot((state) => state.offline)
  const saved = useLot((state) => (state.hydrated ? state.saved.length : 0))

  useEffect(() => {
    void hydrateLot()
    const unlock = () => getPlayer().unlock()
    window.addEventListener("pointerdown", unlock, { once: true })
    return () => window.removeEventListener("pointerdown", unlock)
  }, [])

  return (
    <div className="min-h-dvh bg-ink pb-40 text-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-ink">
        <div className="mx-auto flex max-w-5xl items-end justify-between px-4 pt-3">
          <Link to="/" className="font-display text-5xl leading-none tracking-wide">
            THE LOT
          </Link>
          <p className="pb-1 text-xs font-semibold uppercase tracking-widest text-mist">
            {offline ? "Offline" : "Free press"}
          </p>
        </div>
        <nav className="tape-row mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 py-2">
          {TABS.map((tab) => {
            const on = tab.to === "/" ? path === "/" : path.startsWith(tab.to)
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-semibold uppercase tracking-wide",
                  on ? "bg-brass text-brass-ink" : "text-paper",
                )}
              >
                {tab.label}
                {tab.to === "/phone" && saved > 0 ? <span className="ml-2 tabular-nums">{saved}</span> : null}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 pt-5">
        {children}
        <footer className="mt-16 border-t border-line py-8">
          <p className="max-w-xl text-sm text-mist">
            The Lot does not sell music and does not pay per stream. Ads and artist promo keep the lights on. Post only
            what you own, or what your label approved in writing. Rights holders can pull a tape from the desk.
          </p>
          <p className="mt-3 max-w-xl text-sm text-mist">
            The tapes already on the wall are original pressings made for this place, so the preview can play without
            using anyone else's masters. Your drops stay on this phone until a live press is stood up.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-wide">
            <Link to="/desk" search={{ tape: "" }} className="min-h-11 inline-flex items-center">
              Rights desk
            </Link>
            <Link to="/promote" search={{ tape: "" }} className="min-h-11 inline-flex items-center">
              Promo rates
            </Link>
          </div>
        </footer>
      </main>
      <PlayerBar />
    </div>
  )
}

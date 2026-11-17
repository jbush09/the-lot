import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { WallGrid } from "@/components/lot/cards"
import { fieldClass } from "@/components/lot/ui"
import { GENRES } from "@/lib/lot/catalog"
import { useLot } from "@/lib/lot/store"
import { buildWall } from "@/lib/lot/wall"
import { cn } from "@/lib/utils"

type BrowseSearch = {
  kind: "all" | "single" | "mixtape" | "video"
  q: string
  genre: string
}

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    kind: search.kind === "single" || search.kind === "mixtape" || search.kind === "video" ? search.kind : "all",
    q: typeof search.q === "string" ? search.q : "",
    genre: typeof search.genre === "string" ? search.genre : "",
  }),
  head: () => ({ meta: [{ title: "Browse · THE LOT" }] }),
  component: BrowsePage,
})

const KINDS: { id: BrowseSearch["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mixtape", label: "Mixtapes" },
  { id: "single", label: "Singles" },
  { id: "video", label: "Videos" },
]

function BrowsePage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const [q, setQ] = useState(search.q)

  useEffect(() => setQ(search.q), [search.q])

  const query = search.q.trim().toLowerCase()
  const items = wall.filter((item) => {
    if (item.takenDown) return false
    if (search.kind !== "all" && item.kind !== search.kind) return false
    if (search.genre && item.genre !== search.genre) return false
    if (!query) return true
    const hay = [item.title, item.artist, item.genre, item.blurb, ...item.tracks.map((track) => track.title)]
      .join(" ")
      .toLowerCase()
    return hay.includes(query)
  })

  function go(next: Partial<BrowseSearch>) {
    void navigate({ to: "/browse", search: { ...search, ...next } })
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">The wall</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">Browse</h1>
      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault()
          go({ q: q.trim() })
        }}
      >
        <label className="sr-only" htmlFor="browse-search">
          Search
        </label>
        <input
          id="browse-search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Tapes, artists, songs"
          className={fieldClass}
        />
      </form>
      <div className="tape-row mt-3 flex gap-2 overflow-x-auto pb-1">
        {KINDS.map((kind) => (
          <button
            key={kind.id}
            type="button"
            aria-pressed={search.kind === kind.id}
            onClick={() => go({ kind: kind.id })}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-semibold uppercase tracking-wide",
              search.kind === kind.id ? "bg-brass text-brass-ink" : "border border-line text-paper",
            )}
          >
            {kind.label}
          </button>
        ))}
      </div>
      <div className="tape-row mt-2 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          aria-pressed={!search.genre}
          onClick={() => go({ genre: "" })}
          className={cn(
            "inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-semibold uppercase tracking-wide",
            !search.genre ? "bg-brass text-brass-ink" : "border border-line text-paper",
          )}
        >
          Any sound
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            aria-pressed={search.genre === genre}
            onClick={() => go({ genre })}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center px-3 text-sm font-semibold uppercase tracking-wide",
              search.genre === genre ? "bg-brass text-brass-ink" : "border border-line text-paper",
            )}
          >
            {genre}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-mist tabular-nums">{items.length} showing</p>
      <div className="mt-4">
        <WallGrid items={items} />
      </div>
    </div>
  )
}

import { Link } from "@tanstack/react-router"
import { Download, Play } from "lucide-react"
import { Sleeve } from "@/components/lot/cover"
import { formatCount, kindLabel } from "@/lib/lot/format"
import { playItem } from "@/lib/lot/play"
import type { WallItem } from "@/lib/lot/types"

export function TapeCard({ item }: { item: WallItem }) {
  return (
    <Link
      to="/release/$id"
      params={{ id: item.id }}
      className="group block w-40 shrink-0"
    >
      <Sleeve
        title={item.title}
        cover={item.cover}
        coverKey={item.coverKey}
        sleeve={item.sleeve}
        mark={item.mark}
        promo={item.promo}
      />
      <div className="mt-2">
        <div className="truncate font-display text-2xl leading-none tracking-wide group-hover:text-brass">
          {item.title}
        </div>
        <div className="truncate text-sm text-mist">{item.artist}</div>
      </div>
    </Link>
  )
}

export function WallGrid({ items }: { items: WallItem[] }) {
  if (items.length === 0) {
    return <p className="border border-line bg-panel px-4 py-6 text-mist">Nothing on the wall for that search.</p>
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <Link key={item.id} to="/release/$id" params={{ id: item.id }} className="group block min-w-0">
          <Sleeve
            title={item.title}
            cover={item.cover}
            coverKey={item.coverKey}
            sleeve={item.sleeve}
            mark={item.mark}
            promo={item.promo}
          />
          <div className="mt-2">
            <div className="truncate font-display text-2xl leading-none tracking-wide group-hover:text-brass">
              {item.title}
            </div>
            <div className="truncate text-sm text-mist">
              {item.artist} · {kindLabel(item.kind)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function HotRow({ item, rank }: { item: WallItem; rank: number }) {
  const canPlay = item.tracks.length > 0 && !(item.kind === "video" && item.videoKey && item.tracks.length === 0)
  return (
    <div className="flex items-center gap-3 border-b border-line py-2">
      <span className="w-6 shrink-0 font-display text-2xl text-mist tabular-nums">{rank}</span>
      <Link to="/release/$id" params={{ id: item.id }} className="shrink-0">
        <Sleeve
          title={item.title}
          cover={item.cover}
          coverKey={item.coverKey}
          sleeve={item.sleeve}
          mark={item.mark}
          className="size-14"
        />
      </Link>
      <Link to="/release/$id" params={{ id: item.id }} className="min-w-0 flex-1">
        <div className="truncate font-display text-2xl leading-none tracking-wide">{item.title}</div>
        <div className="truncate text-sm text-mist">{item.artist}</div>
      </Link>
      <span className="hidden text-sm text-mist tabular-nums sm:inline">{formatCount(item.cops)} copped</span>
      {canPlay ? (
        <button
          type="button"
          aria-label={`Play ${item.title}`}
          onClick={() => void playItem(item, 0)}
          className="inline-flex size-11 shrink-0 items-center justify-center bg-brass text-brass-ink"
        >
          <Play className="size-4 fill-current" />
        </button>
      ) : (
        <Link
          to="/release/$id"
          params={{ id: item.id }}
          aria-label={`Watch ${item.title}`}
          className="inline-flex size-11 shrink-0 items-center justify-center border border-line"
        >
          <Play className="size-4" />
        </Link>
      )}
    </div>
  )
}

export function Banner({ item }: { item: WallItem }) {
  return (
    <Link
      to="/release/$id"
      params={{ id: item.id }}
      className="grid gap-4 border border-line bg-panel p-3 sm:grid-cols-[10rem_1fr] sm:items-center"
    >
      <Sleeve
        title={item.title}
        cover={item.cover}
        coverKey={item.coverKey}
        sleeve={item.sleeve}
        mark={item.mark}
        promo="banner"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">Paid promo · not a stream check</p>
        <h2 className="mt-1 font-display text-5xl leading-none tracking-wide">{item.title}</h2>
        <p className="mt-1 text-mist">{item.artist}</p>
        <p className="mt-3 max-w-md text-sm text-paper">{item.blurb}</p>
      </div>
    </Link>
  )
}

export function OpenSlot() {
  return (
    <Link to="/promote" search={{ tape: "" }} className="block border border-line bg-panel px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">Ad · promo</p>
      <p className="mt-1 font-display text-4xl leading-none tracking-wide">Put your tape in this slot.</p>
      <p className="mt-2 max-w-md text-sm text-mist">
        Artists and indie labels pay for the space. Listeners never pay for a song, and nobody gets a per-stream check.
      </p>
    </Link>
  )
}

export function PhoneRow({ item }: { item: WallItem }) {
  return (
    <div className="flex items-center gap-3 border-b border-line py-3">
      <Sleeve
        title={item.title}
        cover={item.cover}
        coverKey={item.coverKey}
        sleeve={item.sleeve}
        mark={item.mark}
        className="size-14 shrink-0"
      />
      <Link to="/release/$id" params={{ id: item.id }} className="min-w-0 flex-1">
        <div className="truncate font-display text-2xl leading-none">{item.title}</div>
        <div className="truncate text-sm text-mist">
          {item.artist} · {kindLabel(item.kind)}
        </div>
      </Link>
      {item.tracks.length > 0 ? (
        <button
          type="button"
          aria-label={`Play ${item.title}`}
          onClick={() => void playItem(item, 0)}
          className="inline-flex size-11 items-center justify-center bg-brass text-brass-ink"
        >
          <Play className="size-4 fill-current" />
        </button>
      ) : null}
      <Link
        to="/release/$id"
        params={{ id: item.id }}
        aria-label={`Open ${item.title}`}
        className="inline-flex size-11 items-center justify-center border border-line"
      >
        <Download className="size-4" />
      </Link>
    </div>
  )
}

import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import { PhoneRow } from "@/components/lot/cards"
import { useLot } from "@/lib/lot/store"
import { buildWall } from "@/lib/lot/wall"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/phone")({
  head: () => ({ meta: [{ title: "Phone · THE LOT" }] }),
  component: PhonePage,
})

function PhonePage() {
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const saved = wall.filter((item) => slice.saved.includes(item.id) && !item.takenDown)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">On this phone</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">My phone</h1>
      <p className="mt-3 max-w-xl text-mist">
        Tapes you copped live here. Flip offline and The Lot will only play these — no stream, no signal.
      </p>
      <button
        type="button"
        aria-pressed={slice.offline}
        disabled={!slice.hydrated}
        onClick={() => useLot.getState().setOffline(!slice.offline)}
        className={cn(
          "mt-4 inline-flex min-h-11 items-center px-4 text-sm font-semibold uppercase tracking-wide",
          slice.offline ? "bg-brass text-brass-ink" : "border border-line text-paper",
        )}
      >
        {slice.offline ? "Offline — phone only" : "Streaming on"}
      </button>
      {!slice.hydrated ? <p className="mt-6 text-mist">Opening your phone…</p> : null}
      {slice.hydrated && saved.length === 0 ? (
        <div className="mt-6 border border-line bg-panel p-4">
          <p className="font-display text-3xl leading-none">Nothing copped yet</p>
          <p className="mt-2 text-sm text-mist">Hit Cop on a tape. It saves here and downloads the file.</p>
          <Link to="/" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-brass">
            Back to the wall
          </Link>
        </div>
      ) : null}
      <div className="mt-4">
        {saved.map((item) => (
          <PhoneRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

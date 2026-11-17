import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { Pause, Play } from "lucide-react"
import { Sleeve } from "@/components/lot/cover"
import { CopButton } from "@/components/lot/cop-button"
import { formatTime } from "@/lib/lot/format"
import { getPlayer, type PlayerSnap } from "@/lib/lot/player"
import { playItem } from "@/lib/lot/play"
import { useLot } from "@/lib/lot/store"
import { buildWall } from "@/lib/lot/wall"

const EMPTY: PlayerSnap = {
  releaseId: null,
  track: 0,
  title: "",
  artist: "",
  cover: null,
  sleeve: "ink",
  mark: "TL",
  playing: false,
  current: 0,
  duration: 0,
  error: null,
  busy: false,
}

function usePlayerSnap() {
  const [snap, setSnap] = useState<PlayerSnap>(EMPTY)
  useEffect(() => {
    setSnap({ ...getPlayer().snap })
    return getPlayer().subscribe(() => setSnap({ ...getPlayer().snap }))
  }, [])
  return snap
}

export function PlayerBar() {
  const snap = usePlayerSnap()
  const slice = useLot()
  const item = buildWall(slice, slice.hydrated ? Date.now() : 0).find((entry) => entry.id === snap.releaseId)
  const quiet = !snap.releaseId

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-5xl grid-cols-[3rem_1fr_auto] items-center gap-3 px-3 py-2">
        {item && snap.releaseId ? (
          <Link to="/release/$id" params={{ id: snap.releaseId }} className="shrink-0">
            <Sleeve
              title={snap.title || item.title}
              cover={snap.cover}
              coverKey={snap.coverKey}
              sleeve={snap.sleeve}
              mark={snap.mark}
              className="size-12"
            />
          </Link>
        ) : (
          <Sleeve title="The Lot" cover={null} sleeve="ink" mark="TL" className="size-12" />
        )}
        <div className="min-w-0">
          <div className="truncate font-display text-2xl leading-none tracking-wide">
            {quiet ? "The Lot is quiet" : snap.title}
          </div>
          <div className="truncate text-xs text-mist">
            {snap.error
              ? snap.error
              : quiet
                ? "Pick a tape and hit play, or cop it straight to your phone."
                : `${snap.artist} · ${formatTime(snap.current)} / ${formatTime(snap.duration)}`}
          </div>
          <input
            className="scrub"
            type="range"
            min={0}
            max={1000}
            value={snap.duration ? Math.round((snap.current / snap.duration) * 1000) : 0}
            aria-label="Seek"
            disabled={!snap.duration}
            onChange={(event) => getPlayer().seek(Number(event.target.value) / 1000)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={snap.playing ? "Pause" : "Play"}
            disabled={quiet || snap.busy}
            onClick={() => {
              if (item) void playItem(item, snap.track)
              else if (snap.playing) getPlayer().pause()
              else getPlayer().resume()
            }}
            className="inline-flex size-12 items-center justify-center bg-brass text-brass-ink disabled:opacity-40"
          >
            {snap.playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </button>
          {item && !item.takenDown ? <CopButton item={item} compact /> : null}
        </div>
      </div>
    </div>
  )
}

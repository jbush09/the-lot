import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { Play } from "lucide-react"
import { Sleeve } from "@/components/lot/cover"
import { CopButton } from "@/components/lot/cop-button"
import { BrassButton, GhostButton, fieldClass, labelClass } from "@/components/lot/ui"
import { Visualizer } from "@/components/lot/visualizer"
import { formatCount, formatDay, formatTime, kindLabel, totalSeconds, trackSeconds } from "@/lib/lot/format"
import { getPlayer, type PlayerSnap } from "@/lib/lot/player"
import { playItem } from "@/lib/lot/play"
import { hydrateLot, useLot } from "@/lib/lot/store"
import { useBlobUrl } from "@/lib/lot/use-blob"
import { buildWall, commentsFor } from "@/lib/lot/wall"

export const Route = createFileRoute("/release/$id")({
  head: () => ({ meta: [{ title: "Tape · THE LOT" }] }),
  component: ReleasePage,
})

function useSnap() {
  const [snap, setSnap] = useState<PlayerSnap | null>(null)
  useEffect(() => {
    setSnap({ ...getPlayer().snap })
    return getPlayer().subscribe(() => setSnap({ ...getPlayer().snap }))
  }, [])
  return snap
}

function ReleasePage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const item = wall.find((entry) => entry.id === id)
  const snap = useSnap()
  const comments = commentsFor(id, slice.comments)
  const [name, setName] = useState(slice.listenerName)
  const [body, setBody] = useState("")
  const videoUrl = useBlobUrl(item?.videoKey)

  useEffect(() => setName(slice.listenerName), [slice.listenerName])

  if (!item) {
    return (
      <div>
        <h1 className="font-display text-6xl leading-none">Not on the wall</h1>
        <p className="mt-3 text-mist">That tape isn't here.</p>
        <Link to="/" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-brass">
          Back to the wall
        </Link>
      </div>
    )
  }

  const playingHere = snap?.releaseId === item.id && snap.playing
  const activeTrack = snap?.releaseId === item.id ? snap.track : -1

  return (
    <div>
      <Link to="/" className="text-sm font-semibold uppercase tracking-wide text-mist">
        Back to the wall
      </Link>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <Sleeve
          title={item.title}
          cover={item.cover}
          coverKey={item.coverKey}
          sleeve={item.sleeve}
          mark={item.mark}
          promo={item.promo}
        />
        <div className="md:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">
            {kindLabel(item.kind)} · {item.genre} · {item.year}
            {item.explicit ? " · Explicit" : ""}
            {item.promo ? ` · ${item.promo} promo` : ""}
          </p>
          <h1 className="mt-2 font-display text-6xl leading-none tracking-wide">{item.title}</h1>
          <Link
            to="/artist/$slug"
            params={{ slug: item.artistSlug }}
            className="mt-2 inline-flex min-h-11 items-center text-lg text-paper"
          >
            {item.artist}
          </Link>
          <p className="max-w-xl text-mist">{item.blurb}</p>
          {item.owned ? (
            <p className="mt-2 text-sm text-mist">
              {item.ownership === "label-approved"
                ? "Posted with written label approval."
                : "Posted as an independent master."}
            </p>
          ) : null}
          <p className="mt-3 text-sm text-mist tabular-nums">
            {formatCount(item.plays)} plays · {formatCount(item.cops)} copped
            {item.tracks.length ? ` · ${formatTime(totalSeconds(item.tracks))}` : ""}
          </p>
          {item.takenDown ? (
            <div className="mt-4 border border-line bg-panel p-4">
              <p className="font-display text-3xl leading-none">Pulled</p>
              <p className="mt-2 text-sm text-mist">
                Removed after a rights notice from {item.takenDown.rep} for {item.takenDown.holder}. The Lot does not
                keep music the owner didn't clear.
              </p>
              <p className="mt-2 text-sm text-paper">{item.takenDown.reason}</p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {item.tracks.length > 0 ? (
                <BrassButton onClick={() => void playItem(item, 0)}>
                  <Play className="size-4 fill-current" />
                  {playingHere ? "Pause" : "Play"}
                </BrassButton>
              ) : null}
              <CopButton item={item} />
              <Link
                to="/promote"
                search={{ tape: item.id }}
                className="inline-flex min-h-11 items-center justify-center border border-line px-4 text-sm font-semibold uppercase tracking-wide"
              >
                Promote
              </Link>
            </div>
          )}
        </div>
      </div>

      {item.videoKey && videoUrl && !item.takenDown ? (
        <video
          className="mt-6 w-full border border-line bg-ink"
          src={videoUrl}
          controls
          playsInline
          onPlay={() => getPlayer().pause()}
        />
      ) : null}

      {item.kind === "video" && !item.videoKey && !item.takenDown ? (
        <div className="mt-6">
          <Visualizer active={Boolean(playingHere)} />
          <p className="mt-2 text-sm text-mist">Lot visual. Cop the audio if you want the song off this page.</p>
        </div>
      ) : null}

      {item.tracks.length > 0 && !item.takenDown ? (
        <ol className="mt-8">
          {item.tracks.map((track, index) => {
            const on = activeTrack === index
            return (
              <li key={track.id}>
                <button
                  type="button"
                  onClick={() => void playItem(item, index)}
                  className="flex min-h-11 w-full items-center gap-3 border-b border-line text-left"
                >
                  <span className="w-6 text-sm text-mist tabular-nums">{index + 1}</span>
                  <span className={on ? "flex-1 truncate text-brass" : "flex-1 truncate"}>{track.title}</span>
                  <span className="text-sm text-mist tabular-nums">{formatTime(trackSeconds(track))}</span>
                </button>
              </li>
            )
          })}
        </ol>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-4xl leading-none">Talk on the tape</h2>
        {item.takenDown ? (
          <p className="mt-2 text-sm text-mist">Comments are closed on a pulled tape.</p>
        ) : (
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              const text = body.trim()
              if (!text) return
              const listener = (name.trim() || "Listener").slice(0, 32)
              void hydrateLot().then(() => {
                useLot.getState().setListenerName(listener)
                useLot.getState().addComment({
                  id: crypto.randomUUID(),
                  releaseId: item.id,
                  name: listener,
                  body: text.slice(0, 400),
                  at: new Date().toISOString(),
                })
                setBody("")
              })
            }}
          >
            <label>
              <span className={labelClass}>Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={32}
                placeholder="Listener"
                className={fieldClass}
              />
            </label>
            <label>
              <span className={labelClass}>Comment</span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                maxLength={400}
                rows={3}
                placeholder="What hit, what didn't."
                className={fieldClass}
              />
            </label>
            <BrassButton type="submit" className="w-fit">
              Post
            </BrassButton>
          </form>
        )}
        <ul className="mt-6">
          {comments.length === 0 ? <li className="text-sm text-mist">No comments yet. Be the first one on this tape.</li> : null}
          {comments.map((comment) => (
            <li key={comment.id} className="border-b border-line py-3">
              <p className="text-sm">
                <span className="font-semibold">{comment.name}</span>
                <span className="text-mist"> · {formatDay(comment.at)}</span>
              </p>
              <p className="mt-1 text-paper">{comment.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {item.owned ? (
          <GhostButton
            onClick={() => {
              void hydrateLot().then(() => {
                getPlayer().stopIf(item.id)
                useLot.getState().removeRelease(item.id)
                void navigate({ to: "/" })
              })
            }}
          >
            Pull my tape
          </GhostButton>
        ) : null}
        <Link
          to="/desk"
          search={{ tape: item.id }}
          className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-mist"
        >
          File a label takedown
        </Link>
      </div>
    </div>
  )
}

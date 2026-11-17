import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { BrassButton, GhostButton, fieldClass, labelClass } from "@/components/lot/ui"
import { PRESS_BEATS } from "@/lib/lot/audio"
import { fileTooBig } from "@/lib/lot/cop"
import { GENRES } from "@/lib/lot/catalog"
import { slugify } from "@/lib/lot/format"
import { idbPut } from "@/lib/lot/idb"
import { hydrateLot, useLot } from "@/lib/lot/store"
import type { Ownership, ReleaseKind, UserTrack } from "@/lib/lot/types"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/drop")({
  head: () => ({ meta: [{ title: "Drop · THE LOT" }] }),
  component: DropPage,
})

type DraftTrack = { key: string; title: string; beatId: string; file?: File }

function readDuration(file: File) {
  return new Promise<number | undefined>((resolve) => {
    const el = document.createElement(file.type.startsWith("video") ? "video" : "audio")
    const url = URL.createObjectURL(file)
    el.preload = "metadata"
    el.onloadedmetadata = () => {
      const duration = el.duration
      URL.revokeObjectURL(url)
      resolve(Number.isFinite(duration) ? duration : undefined)
    }
    el.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(undefined)
    }
    el.src = url
  })
}

function DropPage() {
  const navigate = useNavigate()
  const hydrated = useLot((state) => state.hydrated)
  const [kind, setKind] = useState<ReleaseKind>("single")
  const [artist, setArtist] = useState("")
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState<string>(GENRES[0])
  const [blurb, setBlurb] = useState("")
  const [explicit, setExplicit] = useState(false)
  const [ownership, setOwnership] = useState<Ownership | "">("")
  const [approval, setApproval] = useState("")
  const [attest, setAttest] = useState(false)
  const [tracks, setTracks] = useState<DraftTrack[]>([{ key: "1", title: "", beatId: "soul" }])
  const [videoMode, setVideoMode] = useState<"file" | "visual">("visual")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const showTracks = kind !== "video" || videoMode === "visual"

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">Drop desk</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">Put it on the wall</h1>
      <p className="mt-3 max-w-xl text-mist">
        Singles, mixtapes, and videos. Only if you own them, or your label approved the post in writing. No payout per
        play. Listeners can stream it or cop the file.
      </p>
      <form
        className="mt-6 grid max-w-xl gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["single", "Single"],
              ["mixtape", "Mixtape"],
              ["video", "Video"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() => {
                setKind(id)
                if (id === "single") setTracks((current) => current.slice(0, 1))
              }}
              className={cn(
                "min-h-11 px-2 text-sm font-semibold uppercase tracking-wide",
                kind === id ? "bg-brass text-brass-ink" : "border border-line",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          <span className={labelClass}>Artist</span>
          <input value={artist} onChange={(event) => setArtist(event.target.value)} maxLength={40} className={fieldClass} required />
        </label>
        <label>
          <span className={labelClass}>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={60} className={fieldClass} required />
        </label>
        <label>
          <span className={labelClass}>Sound</span>
          <select value={genre} onChange={(event) => setGenre(event.target.value)} className={fieldClass}>
            {GENRES.map((item) => (
              <option key={item}>{item}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
        <label>
          <span className={labelClass}>Note</span>
          <textarea
            value={blurb}
            onChange={(event) => setBlurb(event.target.value)}
            maxLength={280}
            rows={3}
            placeholder="What is this, in a sentence."
            className={fieldClass}
          />
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={explicit} onChange={(event) => setExplicit(event.target.checked)} className="size-5 accent-brass" />
          <span>Explicit</span>
        </label>
        <div className="grid gap-2">
          <button
            type="button"
            aria-pressed={ownership === "independent"}
            onClick={() => setOwnership("independent")}
            className={cn("px-4 py-3 text-left", ownership === "independent" ? "bg-brass text-brass-ink" : "border border-line")}
          >
            <span className="block font-semibold">I own this</span>
            <span className={cn("block text-sm", ownership === "independent" ? "text-brass-ink" : "text-mist")}>
              No label on the master.
            </span>
          </button>
          <button
            type="button"
            aria-pressed={ownership === "label-approved"}
            onClick={() => setOwnership("label-approved")}
            className={cn("px-4 py-3 text-left", ownership === "label-approved" ? "bg-brass text-brass-ink" : "border border-line")}
          >
            <span className="block font-semibold">Label approved</span>
            <span className={cn("block text-sm", ownership === "label-approved" ? "text-brass-ink" : "text-mist")}>
              A label is attached, and I have it in writing.
            </span>
          </button>
        </div>
        {ownership === "label-approved" ? (
          <label>
            <span className={labelClass}>Approval note</span>
            <input
              value={approval}
              onChange={(event) => setApproval(event.target.value)}
              maxLength={160}
              placeholder="Who approved it, and when"
              className={fieldClass}
            />
          </label>
        ) : null}
        {kind === "video" ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={videoMode === "visual"}
              onClick={() => setVideoMode("visual")}
              className={cn("min-h-11 px-3 text-sm font-semibold uppercase tracking-wide", videoMode === "visual" ? "bg-brass text-brass-ink" : "border border-line")}
            >
              Lot visual
            </button>
            <button
              type="button"
              aria-pressed={videoMode === "file"}
              onClick={() => setVideoMode("file")}
              className={cn("min-h-11 px-3 text-sm font-semibold uppercase tracking-wide", videoMode === "file" ? "bg-brass text-brass-ink" : "border border-line")}
            >
              Video file
            </button>
          </div>
        ) : null}
        {kind === "video" && videoMode === "file" ? (
          <label className="block">
            <span className={labelClass}>Video</span>
            <input
              type="file"
              accept="video/*"
              className="block w-full text-sm"
              onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
            />
          </label>
        ) : null}
        {showTracks
          ? tracks.map((track, index) => (
              <fieldset key={track.key} className="border border-line p-3">
                <legend className="px-1 text-xs font-semibold uppercase tracking-widest text-mist">
                  {kind === "mixtape" ? `Song ${index + 1}` : "Song"}
                </legend>
                <label>
                  <span className={labelClass}>Title</span>
                  <input
                    value={track.title}
                    onChange={(event) => updateTrack(track.key, { title: event.target.value })}
                    maxLength={60}
                    className={fieldClass}
                  />
                </label>
                <label className="mt-3 block">
                  <span className={labelClass}>Press beat</span>
                  <select
                    value={track.beatId}
                    onChange={(event) => updateTrack(track.key, { beatId: event.target.value })}
                    className={fieldClass}
                  >
                    {PRESS_BEATS.map((beat) => (
                      <option key={beat.id} value={beat.id}>
                        {beat.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-2 text-sm text-mist">Lot beats are original. Swap in your own master if you have one.</p>
                <label className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide">
                  Use my audio file
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={(event) => updateTrack(track.key, { file: event.target.files?.[0] })}
                  />
                </label>
                {track.file ? <p className="text-sm text-mist">{track.file.name}</p> : null}
                {kind === "mixtape" && tracks.length > 1 ? (
                  <button type="button" className="mt-2 text-sm text-mist" onClick={() => setTracks((current) => current.filter((item) => item.key !== track.key))}>
                    Remove song
                  </button>
                ) : null}
              </fieldset>
            ))
          : null}
        {kind === "mixtape" && tracks.length < 8 ? (
          <GhostButton
            onClick={() =>
              setTracks((current) => [...current, { key: crypto.randomUUID(), title: "", beatId: "boom" }])
            }
          >
            Add a song
          </GhostButton>
        ) : null}
        <label className="block">
          <span className={labelClass}>Cover, optional</span>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
          />
          <span className="mt-1 block text-sm text-mist">Skip it and the sleeve is a sharpie CDR.</span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={attest}
            onChange={(event) => setAttest(event.target.checked)}
            className="mt-1 size-5 accent-brass"
          />
          <span className="text-sm">
            I have the right to post this. It is not someone else's commercial release. I know The Lot does not sell it
            and does not pay per stream.
          </span>
        </label>
        {error ? <p className="text-sm text-brass">{error}</p> : null}
        <BrassButton type="submit" disabled={busy || !hydrated}>
          {busy ? "Pressing…" : hydrated ? "Drop it" : "Opening the desk…"}
        </BrassButton>
      </form>
    </div>
  )

  function updateTrack(key: string, patch: Partial<DraftTrack>) {
    setTracks((current) => current.map((track) => (track.key === key ? { ...track, ...patch } : track)))
  }

  async function submit() {
    setError("")
    if (!artist.trim() || !title.trim()) return setError("Need an artist and a title.")
    if (!ownership) return setError("Say whether you own this or have label approval.")
    if (ownership === "label-approved" && approval.trim().length < 8) {
      return setError("Add the approval note so a label can recognize it.")
    }
    if (!attest) return setError("Confirm you have the right to post this.")
    if (kind === "video" && videoMode === "file") {
      if (!videoFile) return setError("Add a video file, or switch to a Lot visual.")
      if (fileTooBig(videoFile)) return setError("Keep the video under 80MB.")
    }
    if (showTracks) {
      if (tracks.length === 0) return setError("Add at least one song.")
      if (tracks.some((track) => !track.title.trim())) return setError("Every song needs a title.")
    }
    if (coverFile && coverFile.size > 8 * 1024 * 1024) return setError("Cover images under 8MB.")
    for (const track of tracks) {
      if (track.file && fileTooBig(track.file)) return setError("Keep each audio file under 80MB.")
    }

    setBusy(true)
    try {
      await hydrateLot()
      const id = `u_${crypto.randomUUID()}`
      const userTracks: UserTrack[] = []
      if (showTracks) {
        for (const track of tracks) {
          const trackId = crypto.randomUUID()
          if (track.file) {
            const audioKey = `audio:${trackId}`
            await idbPut(audioKey, track.file)
            userTracks.push({
              id: trackId,
              title: track.title.trim(),
              audioKey,
              duration: await readDuration(track.file),
            })
          } else {
            const beat = PRESS_BEATS.find((item) => item.id === track.beatId)?.spec
            userTracks.push({ id: trackId, title: track.title.trim(), beat })
          }
        }
      }
      let videoKey: string | undefined
      if (kind === "video" && videoMode === "file" && videoFile) {
        videoKey = `video:${id}`
        await idbPut(videoKey, videoFile)
      }
      let coverKey: string | undefined
      if (coverFile) {
        coverKey = `cover:${id}`
        await idbPut(coverKey, coverFile)
      }
      const mark = artist.trim().slice(0, 2).toUpperCase()
      useLot.getState().addRelease({
        id,
        kind,
        title: title.trim(),
        artist: artist.trim(),
        artistSlug: slugify(artist),
        genre,
        year: 2026,
        blurb: blurb.trim() || "Dropped on The Lot.",
        coverKey,
        sleeve: explicit ? "ink" : "brass",
        mark,
        explicit,
        ownership,
        approvalNote: ownership === "label-approved" ? approval.trim() : undefined,
        createdAt: new Date().toISOString(),
        tracks: userTracks,
        videoKey,
      })
      void navigate({ to: "/release/$id", params: { id } })
    } catch {
      setError("Couldn't save that on this phone.")
      setBusy(false)
    }
  }
}

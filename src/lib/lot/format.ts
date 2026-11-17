import { beatSeconds } from "@/lib/lot/audio"
import type { ReleaseKind, WallTrack } from "@/lib/lot/types"

export function formatCount(n: number) {
  const v = Math.max(0, Math.floor(n))
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00"
  const s = Math.floor(sec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatDay(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return slug || "artist"
}

export function safeName(name: string) {
  return name.replace(/[^\w\s.-]+/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "tape"
}

export function kindLabel(kind: ReleaseKind) {
  if (kind === "mixtape") return "Mixtape"
  if (kind === "video") return "Video"
  return "Single"
}

export function trackSeconds(track: WallTrack) {
  if (track.duration && track.duration > 0) return track.duration
  if (track.beat) return beatSeconds(track.beat)
  return 0
}

export function totalSeconds(tracks: WallTrack[]) {
  return tracks.reduce((sum, track) => sum + trackSeconds(track), 0)
}

export function extOf(blob: Blob) {
  const t = blob.type
  if (t.includes("mpeg") || t.includes("mp3")) return "mp3"
  if (t.includes("wav")) return "wav"
  if (t.includes("mp4") || t.includes("m4a") || t.includes("aac")) return "m4a"
  if (t.includes("webm")) return "webm"
  if (t.includes("ogg")) return "ogg"
  if (t.includes("quicktime")) return "mov"
  if (t.includes("video")) return "mp4"
  return "audio"
}

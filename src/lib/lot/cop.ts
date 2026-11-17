import { cachedBeat, encodeWav } from "@/lib/lot/audio"
import { idbGet } from "@/lib/lot/idb"
import { extOf, safeName } from "@/lib/lot/format"
import { zipStore } from "@/lib/lot/zip"
import type { WallItem } from "@/lib/lot/types"

const MAX_BYTES = 80 * 1024 * 1024

export function fileTooBig(file: File) {
  return file.size > MAX_BYTES
}

export async function buildCop(item: WallItem) {
  if (item.takenDown) throw new Error("This tape was pulled.")
  if (item.videoKey) {
    const blob = await idbGet(item.videoKey)
    if (!blob) throw new Error("That video isn't on this phone.")
    return {
      blob,
      filename: `${safeName(item.artist)} - ${safeName(item.title)}.${extOf(blob)}`,
      parts: [{ id: "video", blob }],
    }
  }
  if (item.tracks.length === 0) throw new Error("Nothing to cop on this one.")
  const parts: { id: string; name: string; blob: Blob; data: Uint8Array }[] = []
  let index = 0
  for (const track of item.tracks) {
    index += 1
    let blob: Blob | undefined
    if (track.audioKey) blob = await idbGet(track.audioKey)
    if (!blob && track.beat) blob = encodeWav(cachedBeat(track.beat))
    if (!blob) throw new Error(`No audio for ${track.title}.`)
    const data = new Uint8Array(await blob.arrayBuffer())
    const prefix = String(index).padStart(2, "0")
    parts.push({
      id: track.id,
      name: `${prefix} ${safeName(track.title)}.${extOf(blob)}`,
      blob,
      data,
    })
  }
  if (parts.length === 1) {
    const only = parts[0]
    return {
      blob: only.blob,
      filename: `${safeName(item.artist)} - ${safeName(item.title)}.${extOf(only.blob)}`,
      parts: [{ id: only.id, blob: only.blob }],
    }
  }
  return {
    blob: zipStore(parts.map((part) => ({ name: part.name, data: part.data }))),
    filename: `${safeName(item.artist)} - ${safeName(item.title)}.zip`,
    parts: parts.map((part) => ({ id: part.id, blob: part.blob })),
  }
}

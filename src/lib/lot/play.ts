import { getPlayer } from "@/lib/lot/player"
import { hydrateLot, useLot } from "@/lib/lot/store"
import type { WallItem } from "@/lib/lot/types"

export async function playItem(item: WallItem, track = 0) {
  await hydrateLot()
  const player = getPlayer()
  if (player.snap.busy) return false
  if (player.snap.releaseId === item.id && player.snap.track === track) {
    if (player.snap.playing) {
      player.pause()
      return true
    }
    if (player.canResume()) {
      player.resume()
      return true
    }
  }
  const saved = useLot.getState().saved.includes(item.id)
  const ok = await player.play(item, track, { offline: useLot.getState().offline, saved })
  if (ok) useLot.getState().bumpPlay(item.id)
  return ok
}

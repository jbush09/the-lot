import { ARTISTS, SEED_COMMENTS, SEED_RELEASES } from "@/lib/lot/catalog"
import type { Comment, Promo, Takedown, UserRelease, WallItem } from "@/lib/lot/types"

export type LotSlice = {
  userReleases: UserRelease[]
  playBumps: Record<string, number>
  copBumps: Record<string, number>
  takedowns: Record<string, Takedown>
  promos: Record<string, Promo>
  hydrated: boolean
  comments: Comment[]
}

export function buildWall(slice: LotSlice, now: number): WallItem[] {
  const seed: WallItem[] = SEED_RELEASES.map((release) => {
    const artist = ARTISTS[release.artistSlug]
    const userPromo = slice.hydrated ? slice.promos[release.id] : undefined
    const promo =
      userPromo && now > 0 && userPromo.until > now
        ? userPromo
        : release.seedPromo
          ? { tier: release.seedPromo, at: release.droppedAt, until: Number.POSITIVE_INFINITY }
          : undefined
    return {
      id: release.id,
      origin: "seed",
      kind: release.kind,
      title: release.title,
      artist: release.artist,
      artistSlug: release.artistSlug,
      bio: artist?.bio ?? "",
      genre: release.genre,
      year: release.year,
      blurb: release.blurb,
      cover: release.cover,
      sleeve: release.sleeve,
      mark: release.mark,
      explicit: release.explicit,
      plays: release.basePlays + (slice.playBumps[release.id] ?? 0),
      cops: release.baseCops + (slice.copBumps[release.id] ?? 0),
      promo: promo?.tier,
      promoAt: promo?.at,
      takenDown: slice.takedowns[release.id],
      droppedAt: release.droppedAt,
      tracks: release.tracks.map((track) => ({
        id: track.id,
        title: track.title,
        beat: track.beat,
      })),
      owned: false,
    }
  })

  const custom: WallItem[] = slice.hydrated
    ? slice.userReleases.map((release) => {
        const userPromo = slice.promos[release.id]
        const promo = userPromo && now > 0 && userPromo.until > now ? userPromo : undefined
        return {
          id: release.id,
          origin: "user" as const,
          kind: release.kind,
          title: release.title,
          artist: release.artist,
          artistSlug: release.artistSlug,
          bio: "Independent on The Lot.",
          genre: release.genre,
          year: release.year,
          blurb: release.blurb,
          cover: null,
          coverKey: release.coverKey,
          sleeve: release.sleeve,
          mark: release.mark,
          explicit: release.explicit,
          plays: slice.playBumps[release.id] ?? 0,
          cops: slice.copBumps[release.id] ?? 0,
          promo: promo?.tier,
          promoAt: promo?.at,
          takenDown: slice.takedowns[release.id],
          droppedAt: Date.parse(release.createdAt) || now,
          tracks: release.tracks.map((track) => ({
            id: track.id,
            title: track.title,
            beat: track.beat,
            audioKey: track.audioKey,
            duration: track.duration,
          })),
          videoKey: release.videoKey,
          owned: true,
          ownership: release.ownership,
        }
      })
    : []

  return [...custom, ...seed]
}

export function alive(items: WallItem[]) {
  return items.filter((item) => !item.takenDown)
}

export function bannerItem(items: WallItem[]) {
  return alive(items)
    .filter((item) => item.promo === "banner")
    .sort((a, b) => (b.promoAt ?? 0) - (a.promoAt ?? 0))[0]
}

export function freshList(items: WallItem[]) {
  return alive(items).sort((a, b) => {
    const ar = a.promo === "row" ? 1 : 0
    const br = b.promo === "row" ? 1 : 0
    if (ar !== br) return br - ar
    return b.droppedAt - a.droppedAt
  })
}

export function hottest(items: WallItem[]) {
  return alive(items).sort((a, b) => b.cops - a.cops)
}

export function commentsFor(id: string, extra: Comment[]) {
  return [...extra.filter((comment) => comment.releaseId === id), ...SEED_COMMENTS.filter((c) => c.releaseId === id)].sort(
    (a, b) => (a.at < b.at ? 1 : -1),
  )
}

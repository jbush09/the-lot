export type ReleaseKind = "single" | "mixtape" | "video"
export type PromoTier = "sticker" | "row" | "banner"
export type BeatStyle =
  | "soul"
  | "boom"
  | "pew"
  | "bounce"
  | "stamp"
  | "sodium"
  | "keys"
  | "stoop"
export type SleeveTone = "photo" | "brass" | "ink"
export type Ownership = "independent" | "label-approved"

export type BeatSpec = {
  style: BeatStyle
  bpm: number
  bars: number
  root: number
  take: number
}

export type Hit = { step: number; deg: number; len: number; oct?: number }

export type SeedTrack = { id: string; title: string; beat: BeatSpec }

export type SeedRelease = {
  id: string
  kind: ReleaseKind
  title: string
  artist: string
  artistSlug: string
  genre: string
  year: number
  blurb: string
  cover: string | null
  sleeve: SleeveTone
  mark: string
  explicit: boolean
  basePlays: number
  baseCops: number
  seedPromo?: PromoTier
  droppedAt: number
  tracks: SeedTrack[]
}

export type UserTrack = {
  id: string
  title: string
  beat?: BeatSpec
  audioKey?: string
  duration?: number
}

export type UserRelease = {
  id: string
  kind: ReleaseKind
  title: string
  artist: string
  artistSlug: string
  genre: string
  year: number
  blurb: string
  coverKey?: string
  sleeve: "brass" | "ink"
  mark: string
  explicit: boolean
  ownership: Ownership
  approvalNote?: string
  createdAt: string
  tracks: UserTrack[]
  videoKey?: string
}

export type Comment = {
  id: string
  releaseId: string
  name: string
  body: string
  at: string
}

export type Takedown = {
  rep: string
  holder: string
  reason: string
  at: string
}

export type Promo = {
  tier: PromoTier
  until: number
  at: number
}

export type WallTrack = {
  id: string
  title: string
  beat?: BeatSpec
  audioKey?: string
  duration?: number
}

export type WallItem = {
  id: string
  origin: "seed" | "user"
  kind: ReleaseKind
  title: string
  artist: string
  artistSlug: string
  bio: string
  genre: string
  year: number
  blurb: string
  cover: string | null
  coverKey?: string
  sleeve: SleeveTone
  mark: string
  explicit: boolean
  plays: number
  cops: number
  promo?: PromoTier
  promoAt?: number
  takenDown?: Takedown
  droppedAt: number
  tracks: WallTrack[]
  videoKey?: string
  owned: boolean
  ownership?: Ownership
}

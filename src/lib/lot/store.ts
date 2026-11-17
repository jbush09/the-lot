import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { Comment, PromoTier, Takedown, UserRelease } from "@/lib/lot/types"

type LotState = {
  userReleases: UserRelease[]
  comments: Comment[]
  playBumps: Record<string, number>
  copBumps: Record<string, number>
  saved: string[]
  takedowns: Record<string, Takedown>
  promos: Record<string, { tier: PromoTier; until: number; at: number }>
  listenerName: string
  offline: boolean
  hydrated: boolean
  setListenerName: (name: string) => void
  setOffline: (offline: boolean) => void
  addRelease: (release: UserRelease) => void
  removeRelease: (id: string) => void
  addComment: (comment: Comment) => void
  bumpPlay: (id: string) => void
  bumpCop: (id: string) => void
  markSaved: (id: string) => void
  fileTakedown: (id: string, takedown: Takedown) => void
  setPromo: (id: string, tier: PromoTier) => void
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
}

export const useLot = create<LotState>()(
  persist(
    (set) => ({
      userReleases: [],
      comments: [],
      playBumps: {},
      copBumps: {},
      saved: [],
      takedowns: {},
      promos: {},
      listenerName: "",
      offline: false,
      hydrated: false,
      setListenerName: (listenerName) => set({ listenerName }),
      setOffline: (offline) => set({ offline }),
      addRelease: (release) => set((state) => ({ userReleases: [release, ...state.userReleases] })),
      removeRelease: (id) =>
        set((state) => ({
          userReleases: state.userReleases.filter((release) => release.id !== id),
          saved: state.saved.filter((savedId) => savedId !== id),
        })),
      addComment: (comment) => set((state) => ({ comments: [comment, ...state.comments] })),
      bumpPlay: (id) =>
        set((state) => ({ playBumps: { ...state.playBumps, [id]: (state.playBumps[id] ?? 0) + 1 } })),
      bumpCop: (id) =>
        set((state) => ({ copBumps: { ...state.copBumps, [id]: (state.copBumps[id] ?? 0) + 1 } })),
      markSaved: (id) => set((state) => ({ saved: state.saved.includes(id) ? state.saved : [id, ...state.saved] })),
      fileTakedown: (id, takedown) => set((state) => ({ takedowns: { ...state.takedowns, [id]: takedown } })),
      setPromo: (id, tier) =>
        set((state) => ({
          promos: {
            ...state.promos,
            [id]: { tier, until: Date.now() + 7 * 24 * 60 * 60 * 1000, at: Date.now() },
          },
        })),
    }),
    {
      name: "the-lot-v1",
      skipHydration: true,
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      partialize: (state) => ({
        userReleases: state.userReleases,
        comments: state.comments,
        playBumps: state.playBumps,
        copBumps: state.copBumps,
        saved: state.saved,
        takedowns: state.takedowns,
        promos: state.promos,
        listenerName: state.listenerName,
        offline: state.offline,
      }),
    },
  ),
)

let gate: Promise<void> | null = null

export function hydrateLot() {
  if (typeof window === "undefined") return Promise.resolve()
  if (!gate) {
    gate = Promise.resolve()
      .then(() => useLot.persist.rehydrate())
      .then(() => {
        useLot.setState({ hydrated: true })
      })
      .catch(() => {
        useLot.setState({ hydrated: true })
      })
  }
  return gate
}

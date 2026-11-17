import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo } from "react"
import { WallGrid } from "@/components/lot/cards"
import { ARTISTS } from "@/lib/lot/catalog"
import { useLot } from "@/lib/lot/store"
import { buildWall } from "@/lib/lot/wall"

export const Route = createFileRoute("/artist/$slug")({
  head: () => ({ meta: [{ title: "Artist · THE LOT" }] }),
  component: ArtistPage,
})

function ArtistPage() {
  const { slug } = Route.useParams()
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const items = wall.filter((item) => item.artistSlug === slug && !item.takenDown)
  const known = ARTISTS[slug]
  const name = items[0]?.artist ?? known?.name
  const bio = known?.bio ?? items[0]?.bio

  if (!name) {
    return (
      <div>
        <h1 className="font-display text-6xl leading-none">Not on the wall</h1>
        <p className="mt-3 text-mist">No artist by that name.</p>
      </div>
    )
  }

  return (
    <div>
      <Link to="/browse" search={{ kind: "all", q: "", genre: "" }} className="text-sm font-semibold uppercase tracking-wide text-mist">
        All artists
      </Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-brass">Artist</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">{name}</h1>
      <p className="mt-3 max-w-xl text-mist">{bio}</p>
      <div className="mt-6">
        <WallGrid items={items} />
      </div>
    </div>
  )
}

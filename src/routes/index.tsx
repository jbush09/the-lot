import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { Banner, HotRow, OpenSlot, TapeCard } from "@/components/lot/cards"
import { brassLink, fieldClass, ghostLink } from "@/components/lot/ui"
import { formatCount } from "@/lib/lot/format"
import { useLot } from "@/lib/lot/store"
import { bannerItem, buildWall, freshList, hottest } from "@/lib/lot/wall"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const banner = bannerItem(wall)
  const fresh = freshList(wall).slice(0, 8)
  const hot = hottest(wall).slice(0, 6)
  const videos = freshList(wall).filter((item) => item.kind === "video")
  const aliveCount = wall.filter((item) => !item.takenDown).length
  const cops = wall.reduce((sum, item) => sum + (item.takenDown ? 0 : item.cops), 0)
  const [q, setQ] = useState("")
  const navigate = Route.useNavigate()

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">Unsigned press</p>
      <h1 className="mt-2 max-w-3xl font-display text-7xl leading-none tracking-wide md:text-8xl">
        Cop the tape. Keep the tape.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-mist">
        Stream it on the wall, or save the file on your phone and play it with no signal. Artists keep the masters.
        The Lot never sells the song and never pays per stream.
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link to="/drop" className={brassLink}>
          Drop a tape
        </Link>
        <Link to="/browse" search={{ kind: "all", q: "", genre: "" }} className={ghostLink}>
          Walk the wall
        </Link>
      </div>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          const query = q.trim()
          void navigate({ to: "/browse", search: { kind: "all", q: query, genre: "" } })
        }}
      >
        <label className="sr-only" htmlFor="home-search">
          Search the wall
        </label>
        <input
          id="home-search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search tapes, artists, songs"
          className={fieldClass}
        />
        <button type="submit" className={ghostLink}>
          Search
        </button>
      </form>
      <p className="mt-4 text-sm text-mist tabular-nums">
        {aliveCount} on the wall · {formatCount(cops)} copped
      </p>

      <div className="mt-8">{banner ? <Banner item={banner} /> : <OpenSlot />}</div>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-display text-4xl leading-none tracking-wide">New on the wall</h2>
          <Link to="/browse" search={{ kind: "all", q: "", genre: "" }} className="text-sm font-semibold uppercase tracking-wide text-brass">
            All
          </Link>
        </div>
        <div className="tape-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {fresh.map((item) => (
            <TapeCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-4xl leading-none tracking-wide">Most copped</h2>
        <div className="mt-2">
          {hot.map((item, index) => (
            <HotRow key={item.id} item={item} rank={index + 1} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-4xl leading-none tracking-wide">Visuals</h2>
          <Link to="/browse" search={{ kind: "video", q: "", genre: "" }} className="text-sm font-semibold uppercase tracking-wide text-brass">
            Videos
          </Link>
        </div>
        <div className="tape-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {videos.map((item) => (
            <TapeCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-3 md:grid-cols-3">
        <article className="border border-line bg-panel p-4">
          <h3 className="font-display text-3xl leading-none">Drop it</h3>
          <p className="mt-2 text-sm text-mist">You own the master, or your label said yes in writing. Signed records without approval do not stay up.</p>
        </article>
        <article className="border border-line bg-panel p-4">
          <h3 className="font-display text-3xl leading-none">Cop it</h3>
          <p className="mt-2 text-sm text-mist">Stream here, or save the file on your phone and play it with the signal off. That is the whole mixtape idea.</p>
        </article>
        <article className="border border-line bg-panel p-4">
          <h3 className="font-display text-3xl leading-none">No cut of the song</h3>
          <p className="mt-2 text-sm text-mist">No store. No per-stream payout. Promo slots and ads are how the press stays free for listeners.</p>
        </article>
      </section>
    </div>
  )
}

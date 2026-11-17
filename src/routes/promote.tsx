import { Link, createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { BrassButton, fieldClass, labelClass } from "@/components/lot/ui"
import { hydrateLot, useLot } from "@/lib/lot/store"
import type { PromoTier } from "@/lib/lot/types"
import { alive, buildWall } from "@/lib/lot/wall"
import { cn } from "@/lib/utils"

const TIERS: { id: PromoTier; price: string; name: string; detail: string }[] = [
  { id: "sticker", price: "$10", name: "Sticker", detail: "A promo mark on the sleeve for 7 days." },
  { id: "row", price: "$25", name: "Front row", detail: "Pinned to the front of New on the wall for 7 days." },
  { id: "banner", price: "$49", name: "Banner", detail: "The wide slot under the masthead for 7 days." },
]

export const Route = createFileRoute("/promote")({
  validateSearch: (search: Record<string, unknown>) => ({
    tape: typeof search.tape === "string" ? search.tape : "",
  }),
  head: () => ({ meta: [{ title: "Promo · THE LOT" }] }),
  component: PromotePage,
})

function PromotePage() {
  const { tape } = Route.useSearch()
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => alive(buildWall(slice, now)), [slice, now])
  const [id, setId] = useState(tape)
  const [tier, setTier] = useState<PromoTier>("row")
  const [placed, setPlaced] = useState(false)
  const chosen = TIERS.find((item) => item.id === tier) ?? TIERS[1]

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">How the press gets paid</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">Buy the slot. Not the song.</h1>
      <p className="mt-3 max-w-xl text-mist">
        Listeners never pay to hear or keep a tape. Artists and independent labels pay to be seen. There is no
        per-stream royalty, because The Lot is a press, not a store.
      </p>
      {placed ? (
        <div className="mt-6 max-w-xl border border-line bg-panel p-4">
          <p className="font-display text-4xl leading-none">Slot placed</p>
          <p className="mt-2 text-sm text-mist">
            This demo does not charge a card. On a live Lot, {chosen.price} would buy the {chosen.name.toLowerCase()}{" "}
            for 7 days. The song is still free to cop.
          </p>
          <Link to="/" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wide text-brass">
            See the wall
          </Link>
        </div>
      ) : (
        <form
          className="mt-6 grid max-w-xl gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!id) return
            void hydrateLot().then(() => {
              useLot.getState().setPromo(id, tier)
              setPlaced(true)
            })
          }}
        >
          <label>
            <span className={labelClass}>Tape</span>
            <select value={id} onChange={(event) => setId(event.target.value)} className={fieldClass} required>
              <option value="">Select a release</option>
              {wall.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.artist} — {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-2">
            {TIERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={tier === item.id}
                onClick={() => setTier(item.id)}
                className={cn("px-4 py-3 text-left", tier === item.id ? "bg-brass text-brass-ink" : "border border-line")}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-3xl leading-none">{item.name}</span>
                  <span className="text-sm font-semibold tabular-nums">{item.price}</span>
                </span>
                <span className={cn("mt-1 block text-sm", tier === item.id ? "text-brass-ink" : "text-mist")}>
                  {item.detail}
                </span>
              </button>
            ))}
          </div>
          <BrassButton type="submit" disabled={!id || !slice.hydrated}>
            Place the {chosen.name.toLowerCase()} · {chosen.price}
          </BrassButton>
          <p className="text-sm text-mist">No card is charged in this preview. The slot still moves on the wall so you can see what the money buys.</p>
        </form>
      )}
    </div>
  )
}

import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { BrassButton, fieldClass, labelClass } from "@/components/lot/ui"
import { formatDay } from "@/lib/lot/format"
import { getPlayer } from "@/lib/lot/player"
import { hydrateLot, useLot } from "@/lib/lot/store"
import { buildWall } from "@/lib/lot/wall"

export const Route = createFileRoute("/desk")({
  validateSearch: (search: Record<string, unknown>) => ({
    tape: typeof search.tape === "string" ? search.tape : "",
  }),
  head: () => ({ meta: [{ title: "Rights desk · THE LOT" }] }),
  component: DeskPage,
})

function DeskPage() {
  const { tape } = Route.useSearch()
  const slice = useLot()
  const now = slice.hydrated ? Date.now() : 0
  const wall = useMemo(() => buildWall(slice, now), [slice, now])
  const [id, setId] = useState(tape)
  const [rep, setRep] = useState("")
  const [holder, setHolder] = useState("")
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const pulled = wall.filter((item) => item.takenDown)

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">Rights desk</p>
      <h1 className="font-display text-6xl leading-none tracking-wide">Pull a tape</h1>
      <div className="mt-4 max-w-xl space-y-3 text-mist">
        <p>
          The Lot is for artists who own their music, and for signed artists who have written label approval. It is not
          a store and it does not pay per stream.
        </p>
        <p>
          If you hold the rights and a post uses them without permission, file the notice. Name the work, the owner, and
          why it has to come down. A live press would remove it for everyone. In this preview the pull sticks on this
          phone.
        </p>
      </div>
      <form
        className="mt-6 grid max-w-xl gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!id) return setNote("Pick the tape.")
          if (rep.trim().length < 2 || holder.trim().length < 2) return setNote("Need a name and a rights holder.")
          if (reason.trim().length < 12) return setNote("Say what is infringing, in a sentence.")
          void hydrateLot().then(() => {
            useLot.getState().fileTakedown(id, {
              rep: rep.trim().slice(0, 80),
              holder: holder.trim().slice(0, 80),
              reason: reason.trim().slice(0, 500),
              at: new Date().toISOString(),
            })
            getPlayer().stopIf(id)
            setNote("Pulled. It won't play or download on this phone.")
            setReason("")
          })
        }}
      >
        <label>
          <span className={labelClass}>Tape</span>
          <select value={id} onChange={(event) => setId(event.target.value)} className={fieldClass}>
            <option value="">Select a release</option>
            {wall.map((item) => (
              <option key={item.id} value={item.id}>
                {item.artist} — {item.title}
                {item.takenDown ? " (pulled)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Your name</span>
          <input value={rep} onChange={(event) => setRep(event.target.value)} className={fieldClass} maxLength={80} />
        </label>
        <label>
          <span className={labelClass}>Rights holder</span>
          <input
            value={holder}
            onChange={(event) => setHolder(event.target.value)}
            className={fieldClass}
            maxLength={80}
            placeholder="Label or owner"
          />
        </label>
        <label>
          <span className={labelClass}>What has to come down</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={fieldClass}
            rows={4}
            maxLength={500}
          />
        </label>
        <BrassButton type="submit">File the notice</BrassButton>
        {note ? <p className="text-sm text-mist">{note}</p> : null}
      </form>
      {pulled.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-display text-4xl leading-none">Already pulled</h2>
          <ul className="mt-3">
            {pulled.map((item) => (
              <li key={item.id} className="border-b border-line py-3">
                <p className="font-semibold">
                  {item.artist} — {item.title}
                </p>
                <p className="text-sm text-mist">
                  {item.takenDown?.holder} · {item.takenDown ? formatDay(item.takenDown.at) : ""}
                </p>
                <p className="mt-1 text-sm">{item.takenDown?.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

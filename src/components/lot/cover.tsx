import { useState } from "react"
import { cn } from "@/lib/utils"
import { useBlobUrl } from "@/lib/lot/use-blob"
import type { SleeveTone } from "@/lib/lot/types"

type SleeveProps = {
  title: string
  cover: string | null
  coverKey?: string
  sleeve: SleeveTone
  mark: string
  promo?: string
  className?: string
}

export function Sleeve({ title, cover, coverKey, sleeve, mark, promo, className }: SleeveProps) {
  const blobUrl = useBlobUrl(coverKey)
  const [broken, setBroken] = useState(false)
  const src = blobUrl ?? (broken ? null : cover)

  return (
    <div className={cn("relative aspect-square overflow-hidden bg-panel", className)}>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <TypeSleeve title={title} mark={mark} tone={sleeve === "ink" ? "ink" : "brass"} />
      )}
      {promo ? (
        <span className="absolute left-2 top-2 bg-brass px-2 py-1 text-xs font-semibold uppercase tracking-widest text-brass-ink">
          Promo
        </span>
      ) : null}
    </div>
  )
}

function TypeSleeve({ title, mark, tone }: { title: string; mark: string; tone: "brass" | "ink" }) {
  const brass = tone === "brass"
  return (
    <div className={cn("flex h-full w-full flex-col justify-between p-3", brass ? "bg-brass text-brass-ink" : "bg-ink text-paper")}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
        <span>The Lot</span>
        <span>CDR</span>
      </div>
      <div className="font-display text-6xl leading-none">{mark}</div>
      <div className="font-display text-2xl leading-none tracking-wide">{title}</div>
    </div>
  )
}

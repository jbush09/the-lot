import { useState } from "react"
import { Download } from "lucide-react"
import { BrassButton } from "@/components/lot/ui"
import { buildCop } from "@/lib/lot/cop"
import { deliverFile } from "@/lib/lot/deliver"
import { idbPut } from "@/lib/lot/idb"
import { hydrateLot, useLot } from "@/lib/lot/store"
import type { WallItem } from "@/lib/lot/types"
import { cn } from "@/lib/utils"

export function CopButton({ item, block, compact }: { item: WallItem; block?: boolean; compact?: boolean }) {
  const saved = useLot((state) => state.saved.includes(item.id))
  const [phase, setPhase] = useState<"idle" | "pressing" | "done" | "error">("idle")
  const [note, setNote] = useState("")
  if (item.takenDown) return null

  return (
    <div className={cn(block && "w-full")}>
      <BrassButton
        className={cn(block && "w-full", compact && "size-12 px-0")}
        disabled={phase === "pressing"}
        aria-label={saved ? "Cop again" : "Cop to your phone"}
        onClick={() => void cop()}
      >
        <Download className="size-4" />
        {compact ? null : phase === "pressing" ? "Pressing…" : saved ? "Cop again" : item.kind === "mixtape" ? "Cop the tape" : "Cop"}
      </BrassButton>
      {!compact && note ? <p className="mt-2 text-sm text-mist">{note}</p> : null}
    </div>
  )

  async function cop() {
    setPhase("pressing")
    setNote("")
    try {
      await hydrateLot()
      const built = await buildCop(item)
      for (const part of built.parts) {
        await idbPut(`phone:${item.id}:${part.id}`, part.blob)
      }
      const already = useLot.getState().saved.includes(item.id)
      useLot.getState().markSaved(item.id)
      if (!already) useLot.getState().bumpCop(item.id)
      const how = await deliverFile(built.blob, built.filename)
      setPhase("done")
      setNote(
        how === "aborted"
          ? "Saved in Phone. You dismissed the share sheet, and it still plays here with no signal."
          : how === "shared"
            ? "Saved in Phone, and the file is on its way to your device."
            : "Saved in Phone. The file is downloading so you can play it outside The Lot.",
      )
    } catch (err) {
      setPhase("error")
      setNote(err instanceof Error ? err.message : "Couldn't press that.")
    }
  }
}

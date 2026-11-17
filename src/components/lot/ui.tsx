import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const fieldClass =
  "min-h-11 w-full border border-line bg-panel px-3 text-base text-paper placeholder:text-mist"
export const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-widest text-mist"
export const brassLink =
  "inline-flex min-h-11 items-center justify-center gap-2 bg-brass px-4 text-sm font-semibold uppercase tracking-wide text-brass-ink"
export const ghostLink =
  "inline-flex min-h-11 items-center justify-center gap-2 border border-line px-4 text-sm font-semibold uppercase tracking-wide text-paper"

export function BrassButton({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(brassLink, "disabled:opacity-50", className)} {...props} />
}

export function GhostButton({ className, type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(ghostLink, "disabled:opacity-50", className)} {...props} />
}

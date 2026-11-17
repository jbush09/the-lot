import { useEffect, useRef } from "react"
import { getPlayer } from "@/lib/lot/player"

export function Visualizer({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const styles = getComputedStyle(document.documentElement)
    const brass = styles.getPropertyValue("--color-brass").trim() || "#e3a008"
    const line = styles.getPropertyValue("--color-line").trim() || "#3a3228"
    let raf = 0

    const draw = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const ratio = window.devicePixelRatio || 1
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio)
        canvas.height = Math.floor(height * ratio)
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, width, height)
      const analyser = getPlayer().getAnalyser()
      const bins = new Uint8Array(analyser ? analyser.frequencyBinCount : 16)
      if (analyser && active) analyser.getByteFrequencyData(bins)
      const count = 24
      const gap = 4
      const bar = (width - gap * (count - 1)) / count
      for (let i = 0; i < count; i++) {
        const raw = bins[i % bins.length] ?? 0
        const level = active ? Math.max(0.06, raw / 255) : 0.08
        const h = Math.max(4, level * height * 0.86)
        ctx.fillStyle = active ? brass : line
        ctx.fillRect(i * (bar + gap), height - h, bar, h)
      }
      if (active && !reduce) raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [active])

  return <canvas ref={ref} className="h-48 w-full border border-line bg-ink" />
}

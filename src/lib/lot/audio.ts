import type { BeatSpec, BeatStyle, Hit } from "@/lib/lot/types"

export const SAMPLE_RATE = 32000

const MINOR = [0, 2, 3, 5, 7, 8, 10]

type StyleDef = {
  swing: number
  kick: string
  snare: string
  hat: string
  open: string
  bassA: Hit[]
  bassB: Hit[]
  leadA: Hit[]
  leadB: Hit[]
  stabs: number[]
}

const STYLES: Record<BeatStyle, StyleDef> = {
  soul: {
    swing: 0.16,
    kick: "x...x..x...x..x.",
    snare: "....x.......x...",
    hat: "..x...x...x...x.",
    open: "............x...",
    bassA: [
      { step: 0, deg: 0, len: 6 },
      { step: 6, deg: 0, len: 4 },
      { step: 10, deg: 4, len: 4 },
      { step: 14, deg: 3, len: 2 },
    ],
    bassB: [
      { step: 0, deg: 3, len: 6 },
      { step: 6, deg: 0, len: 4 },
      { step: 10, deg: 6, len: 4 },
      { step: 14, deg: 4, len: 2 },
    ],
    leadA: [
      { step: 0, deg: 0, len: 2 },
      { step: 4, deg: 2, len: 2 },
      { step: 8, deg: 4, len: 3 },
      { step: 12, deg: 2, len: 2 },
    ],
    leadB: [
      { step: 0, deg: 3, len: 2 },
      { step: 4, deg: 2, len: 2 },
      { step: 8, deg: 0, len: 4 },
    ],
    stabs: [0, 10],
  },
  boom: {
    swing: 0.06,
    kick: "x...x...x...x...",
    snare: "....x.......x...",
    hat: "x.x.x.x.x.x.x.x.",
    open: "........x.......",
    bassA: [
      { step: 0, deg: 0, len: 8 },
      { step: 8, deg: 0, len: 4 },
      { step: 12, deg: 4, len: 4 },
    ],
    bassB: [
      { step: 0, deg: 0, len: 4 },
      { step: 4, deg: 0, len: 4 },
      { step: 8, deg: 5, len: 4 },
      { step: 12, deg: 3, len: 4 },
    ],
    leadA: [
      { step: 2, deg: 0, len: 2 },
      { step: 6, deg: 2, len: 2 },
      { step: 10, deg: 4, len: 2 },
      { step: 14, deg: 2, len: 2 },
    ],
    leadB: [
      { step: 0, deg: 4, len: 2 },
      { step: 8, deg: 3, len: 2 },
      { step: 12, deg: 0, len: 4 },
    ],
    stabs: [],
  },
  pew: {
    swing: 0.02,
    kick: "x...............",
    snare: "........x.......",
    hat: "..x...x...x...x.",
    open: "..............x.",
    bassA: [{ step: 0, deg: 0, len: 16 }],
    bassB: [
      { step: 0, deg: 5, len: 8 },
      { step: 8, deg: 3, len: 8 },
    ],
    leadA: [
      { step: 0, deg: 0, len: 4 },
      { step: 8, deg: 2, len: 4 },
    ],
    leadB: [
      { step: 0, deg: 3, len: 4 },
      { step: 8, deg: 0, len: 6 },
    ],
    stabs: [0],
  },
  bounce: {
    swing: 0,
    kick: "x..x..x...x.x...",
    snare: "....x.......x...",
    hat: "xxxxxxxxxxxxxxxx",
    open: "........x...x...",
    bassA: [
      { step: 0, deg: 0, len: 3 },
      { step: 4, deg: 0, len: 3, oct: 1 },
      { step: 8, deg: 0, len: 3 },
      { step: 12, deg: 4, len: 4 },
    ],
    bassB: [
      { step: 0, deg: 3, len: 4 },
      { step: 4, deg: 0, len: 4, oct: 1 },
      { step: 8, deg: 6, len: 4 },
      { step: 12, deg: 0, len: 4 },
    ],
    leadA: [
      { step: 0, deg: 0, len: 1 },
      { step: 2, deg: 2, len: 1 },
      { step: 4, deg: 4, len: 2 },
      { step: 8, deg: 4, len: 1 },
      { step: 10, deg: 2, len: 1 },
      { step: 12, deg: 0, len: 2 },
    ],
    leadB: [
      { step: 0, deg: 2, len: 2 },
      { step: 4, deg: 0, len: 2 },
      { step: 8, deg: 4, len: 4 },
    ],
    stabs: [],
  },
  stamp: {
    swing: 0,
    kick: "x.....x.x.....x.",
    snare: "....x.......x...",
    hat: "xxxxxxxxxxxxxxxx",
    open: "........x.......",
    bassA: [
      { step: 0, deg: 0, len: 4 },
      { step: 4, deg: 0, len: 3 },
      { step: 7, deg: 6, len: 3 },
      { step: 10, deg: 0, len: 4 },
      { step: 14, deg: 4, len: 2 },
    ],
    bassB: [
      { step: 0, deg: 5, len: 4 },
      { step: 4, deg: 0, len: 6 },
      { step: 10, deg: 3, len: 4 },
      { step: 14, deg: 0, len: 2 },
    ],
    leadA: [
      { step: 0, deg: 0, len: 1 },
      { step: 6, deg: 3, len: 1 },
      { step: 10, deg: 4, len: 2 },
    ],
    leadB: [
      { step: 2, deg: 6, len: 1 },
      { step: 8, deg: 4, len: 2 },
      { step: 12, deg: 0, len: 2 },
    ],
    stabs: [],
  },
  sodium: {
    swing: 0.04,
    kick: "x.........x.....",
    snare: "....x.......x...",
    hat: "....x.......x...",
    open: "..............x.",
    bassA: [
      { step: 0, deg: 0, len: 10 },
      { step: 10, deg: 6, len: 6 },
    ],
    bassB: [
      { step: 0, deg: 5, len: 8 },
      { step: 8, deg: 3, len: 8 },
    ],
    leadA: [
      { step: 4, deg: 0, len: 3 },
      { step: 12, deg: 3, len: 3 },
    ],
    leadB: [
      { step: 0, deg: 4, len: 4 },
      { step: 8, deg: 0, len: 4 },
    ],
    stabs: [0],
  },
  keys: {
    swing: 0.1,
    kick: "x...x...x..x....",
    snare: "....x.......x...",
    hat: "x..x..x.x..x..x.",
    open: "..............x.",
    bassA: [
      { step: 0, deg: 0, len: 4 },
      { step: 4, deg: 3, len: 4 },
      { step: 8, deg: 4, len: 4 },
      { step: 12, deg: 3, len: 4 },
    ],
    bassB: [
      { step: 0, deg: 5, len: 4 },
      { step: 4, deg: 4, len: 4 },
      { step: 8, deg: 3, len: 4 },
      { step: 12, deg: 0, len: 4 },
    ],
    leadA: [
      { step: 0, deg: 0, len: 2 },
      { step: 2, deg: 2, len: 2 },
      { step: 4, deg: 3, len: 2 },
      { step: 8, deg: 4, len: 2 },
      { step: 10, deg: 2, len: 2 },
      { step: 12, deg: 0, len: 4 },
    ],
    leadB: [
      { step: 0, deg: 4, len: 2 },
      { step: 4, deg: 2, len: 2 },
      { step: 8, deg: 0, len: 6 },
    ],
    stabs: [0, 8],
  },
  stoop: {
    swing: 0.08,
    kick: "x...........x...",
    snare: "....x...........",
    hat: "......x.......x.",
    open: "................",
    bassA: [
      { step: 0, deg: 0, len: 12 },
      { step: 12, deg: 4, len: 4 },
    ],
    bassB: [
      { step: 0, deg: 3, len: 8 },
      { step: 8, deg: 0, len: 8 },
    ],
    leadA: [{ step: 8, deg: 0, len: 4 }],
    leadB: [
      { step: 4, deg: 2, len: 4 },
      { step: 12, deg: 4, len: 4 },
    ],
    stabs: [0],
  },
}

export const PRESS_BEATS: { id: string; name: string; spec: BeatSpec }[] = [
  { id: "soul", name: "Slow soul · 84", spec: { style: "soul", bpm: 84, bars: 8, root: 41, take: 1 } },
  { id: "boom", name: "Boom bap · 94", spec: { style: "boom", bpm: 94, bars: 8, root: 38, take: 1 } },
  { id: "pew", name: "Half-time · 76", spec: { style: "pew", bpm: 76, bars: 8, root: 36, take: 1 } },
  { id: "bounce", name: "Bounce · 100", spec: { style: "bounce", bpm: 100, bars: 8, root: 39, take: 1 } },
  { id: "stamp", name: "Fast hats · 140", spec: { style: "stamp", bpm: 140, bars: 8, root: 36, take: 1 } },
  { id: "sodium", name: "Night drive · 86", spec: { style: "sodium", bpm: 86, bars: 8, root: 33, take: 1 } },
  { id: "keys", name: "Keys · 90", spec: { style: "keys", bpm: 90, bars: 8, root: 43, take: 1 } },
  { id: "stoop", name: "Stoop · 78", spec: { style: "stoop", bpm: 78, bars: 8, root: 37, take: 2 } },
]

export function beatSeconds(spec: BeatSpec) {
  return (spec.bars * 4 * 60) / spec.bpm
}

export function beatKey(spec: BeatSpec) {
  return `${spec.style}|${spec.bpm}|${spec.bars}|${spec.root}|${spec.take}`
}

const cache = new Map<string, Float32Array>()
const cacheOrder: string[] = []

export function cachedBeat(spec: BeatSpec) {
  const key = beatKey(spec)
  const hit = cache.get(key)
  if (hit) return hit
  const pcm = renderBeat(spec)
  cache.set(key, pcm)
  cacheOrder.push(key)
  if (cacheOrder.length > 4) {
    const old = cacheOrder.shift()
    if (old) cache.delete(old)
  }
  return pcm
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSpec(spec: BeatSpec) {
  const s = beatKey(spec)
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function stepStart(step: number, bpm: number, swing: number) {
  const sixteenth = 60 / bpm / 4
  const base = step * sixteenth
  return step % 2 === 1 ? base + sixteenth * swing : base
}

function midiHz(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

function degMidi(root: number, deg: number, oct: number) {
  const d = ((deg % 7) + 7) % 7
  const wrap = Math.floor(deg / 7)
  return root + MINOR[d] + 12 * (oct + wrap)
}

function rotate(pattern: string, n: number) {
  const k = ((n % pattern.length) + pattern.length) % pattern.length
  return pattern.slice(k) + pattern.slice(0, k)
}

function addKick(out: Float32Array, start: number, sr: number) {
  const n = Math.min(out.length - start, Math.floor(0.42 * sr))
  if (n <= 0) return
  let phase = 0
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const f = 48 + 150 * Math.exp(-t * 28)
    const amp = Math.exp(-t * 8)
    const body = Math.sin(phase)
    const click = Math.sin(i * 1.7) * Math.exp(-t * 220) * 0.45
    out[start + i] += (body + click) * amp
    phase += (2 * Math.PI * f) / sr
  }
}

function addSnare(out: Float32Array, start: number, sr: number, rng: () => number) {
  const n = Math.min(out.length - start, Math.floor(0.2 * sr))
  if (n <= 0) return
  let phase = 0
  let prevX = 0
  let prevY = 0
  const delay = Math.floor(0.11 * sr)
  for (let i = 0; i < n; i++) {
    const t = i / sr
    phase += (2 * Math.PI * 188) / sr
    const x = rng() * 2 - 1
    const y = x - prevX + 0.82 * prevY
    prevX = x
    prevY = y
    const s = Math.sin(phase) * Math.exp(-t * 30) * 0.4 + y * Math.exp(-t * 18) * 0.5
    out[start + i] += s
    const d = start + i + delay
    if (d < out.length) out[d] += s * 0.22
  }
}

function addHat(
  out: Float32Array,
  start: number,
  sr: number,
  rng: () => number,
  open: boolean,
  gain: number,
) {
  const dur = open ? 0.18 : 0.04
  const n = Math.min(out.length - start, Math.floor(dur * sr))
  if (n <= 0) return
  let prevX = 0
  let prevY = 0
  const decay = open ? 12 : 48
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const x = rng() * 2 - 1
    const y = x - prevX + 0.55 * prevY
    prevX = x
    prevY = y
    out[start + i] += y * Math.exp(-t * decay) * gain
  }
}

function addBass(out: Float32Array, start: number, midi: number, dur: number, sr: number) {
  const n = Math.min(out.length - start, Math.floor(dur * sr))
  if (n <= 0) return
  const freq = midiHz(midi)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const f = freq * (1 + 0.4 * Math.exp(-t * 36))
    const env = Math.exp(-t * 1.7) * (1 - Math.exp(-t * 80))
    out[start + i] += Math.tanh(2.3 * Math.sin(phase)) * env * 0.7
    phase += (2 * Math.PI * f) / sr
  }
}

function addLead(
  out: Float32Array,
  start: number,
  midi: number,
  dur: number,
  sr: number,
  gain: number,
) {
  const n = Math.min(out.length - start, Math.floor(dur * sr))
  if (n <= 0) return
  const freq = midiHz(midi)
  let phase = 0
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const env = Math.exp(-t * 4.2) * (1 - Math.exp(-t * 140))
    const s = Math.tanh(1.5 * Math.sin(phase)) + Math.sin(phase * 2) * 0.2
    out[start + i] += s * env * gain
    phase += (2 * Math.PI * freq) / sr
  }
}

function addStab(out: Float32Array, start: number, midi: number, sr: number) {
  addLead(out, start, midi, 0.42, sr, 0.09)
  addLead(out, start, midi + 3, 0.42, sr, 0.07)
  addLead(out, start, midi + 7, 0.42, sr, 0.05)
}

function schedule(pattern: string, total: number, fn: (step: number) => void) {
  for (let step = 0; step < total; step++) {
    if (pattern[step % pattern.length] === "x") fn(step)
  }
}

function placeHits(
  out: Float32Array,
  hits: Hit[],
  bar: number,
  spec: BeatSpec,
  swing: number,
  sr: number,
  kind: "bass" | "lead",
) {
  const sixteenth = 60 / spec.bpm / 4
  for (const hit of hits) {
    const step = bar * 16 + hit.step
    const start = Math.floor(stepStart(step, spec.bpm, swing) * sr)
    const dur = Math.max(0.08, hit.len * sixteenth * 0.95)
    const oct = kind === "bass" ? (hit.oct ?? 0) : (hit.oct ?? 2)
    const midi = degMidi(spec.root, hit.deg, oct)
    if (kind === "bass") addBass(out, start, midi, dur, sr)
    else addLead(out, start, midi, dur, sr, 0.15)
  }
}

function finish(out: Float32Array) {
  let peak = 0
  for (let i = 0; i < out.length; i++) peak = Math.max(peak, Math.abs(out[i]))
  const g = peak > 0.0001 ? 0.9 / peak : 1
  const shape = Math.tanh(1.2)
  for (let i = 0; i < out.length; i++) out[i] = Math.tanh(out[i] * g * 1.2) / shape
}

export function renderBeat(spec: BeatSpec) {
  const style = STYLES[spec.style]
  for (const pattern of [style.kick, style.snare, style.hat, style.open]) {
    if (pattern.length !== 16) throw new Error(`Bad pattern length for ${spec.style}`)
  }
  const swing = style.swing
  const total = spec.bars * 16
  const seconds = stepStart(total, spec.bpm, swing) + 1.5
  const n = Math.ceil(seconds * SAMPLE_RATE)
  const drums = new Float32Array(n)
  const music = new Float32Array(n)
  const rng = mulberry32(hashSpec(spec) || 1)
  const hat = rotate(style.hat, spec.take % 4)
  const kickSteps: number[] = []

  schedule(style.kick, total, (step) => {
    kickSteps.push(step)
    addKick(drums, Math.floor(stepStart(step, spec.bpm, swing) * SAMPLE_RATE), SAMPLE_RATE)
  })
  schedule(style.snare, total, (step) => {
    addSnare(drums, Math.floor(stepStart(step, spec.bpm, swing) * SAMPLE_RATE), SAMPLE_RATE, rng)
  })
  schedule(hat, total, (step) => {
    const accent = step % 4 === 0 ? 0.2 : step % 2 === 0 ? 0.14 : 0.08
    addHat(drums, Math.floor(stepStart(step, spec.bpm, swing) * SAMPLE_RATE), SAMPLE_RATE, rng, false, accent)
  })
  schedule(style.open, total, (step) => {
    addHat(drums, Math.floor(stepStart(step, spec.bpm, swing) * SAMPLE_RATE), SAMPLE_RATE, rng, true, 0.2)
  })

  for (let bar = 0; bar < spec.bars; bar++) {
    const bass = bar % 2 === 1 && style.bassB.length ? style.bassB : style.bassA
    const lead = bar % 2 === 1 && style.leadB.length ? style.leadB : style.leadA
    placeHits(music, bass, bar, spec, swing, SAMPLE_RATE, "bass")
    placeHits(music, lead, bar, spec, swing, SAMPLE_RATE, "lead")
    if (style.stabs.length && bar % 2 === 0) {
      for (const step of style.stabs) {
        const start = Math.floor(stepStart(bar * 16 + step, spec.bpm, swing) * SAMPLE_RATE)
        addStab(music, start, spec.root + 12, SAMPLE_RATE)
      }
    }
  }

  for (const step of kickSteps) {
    const start = Math.floor(stepStart(step, spec.bpm, swing) * SAMPLE_RATE)
    const len = Math.floor(0.08 * SAMPLE_RATE)
    for (let i = 0; i < len; i++) {
      const idx = start + i
      if (idx >= music.length) break
      music[idx] *= 0.3 + 0.7 * (i / len)
    }
  }

  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = drums[i] + music[i]
  finish(out)
  return out
}

export function encodeWav(pcm: Float32Array, sampleRate = SAMPLE_RATE) {
  const n = pcm.length
  const buffer = new ArrayBuffer(44 + n * 2)
  const view = new DataView(buffer)
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
  }
  write(0, "RIFF")
  view.setUint32(4, 36 + n * 2, true)
  write(8, "WAVE")
  write(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  write(36, "data")
  view.setUint32(40, n * 2, true)
  let offset = 44
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i] ?? 0))
    view.setInt16(offset, Math.round(s * 32767), true)
    offset += 2
  }
  return new Blob([buffer], { type: "audio/wav" })
}

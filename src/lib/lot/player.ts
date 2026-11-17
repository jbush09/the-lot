import { cachedBeat, SAMPLE_RATE } from "@/lib/lot/audio"
import { idbGet } from "@/lib/lot/idb"
import type { SleeveTone, WallItem } from "@/lib/lot/types"

export type PlayerSnap = {
  releaseId: string | null
  track: number
  title: string
  artist: string
  cover: string | null
  coverKey?: string
  sleeve: SleeveTone
  mark: string
  playing: boolean
  current: number
  duration: number
  error: string | null
  busy: boolean
}

function emptySnap(): PlayerSnap {
  return {
    releaseId: null,
    track: 0,
    title: "",
    artist: "",
    cover: null,
    sleeve: "ink",
    mark: "TL",
    playing: false,
    current: 0,
    duration: 0,
    error: null,
    busy: false,
  }
}

type PlayOpts = { offline: boolean; saved: boolean }

class Player {
  snap: PlayerSnap = emptySnap()
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private gain: GainNode | null = null
  private source: AudioBufferSourceNode | null = null
  private buffer: AudioBuffer | null = null
  private item: WallItem | null = null
  private opts: PlayOpts = { offline: false, saved: false }
  private offset = 0
  private startedAt = 0
  private raf = 0
  private lastUi = 0
  private stopping = false
  private advancing = false
  private listeners = new Set<() => void>()

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private emit() {
    for (const listener of this.listeners) listener()
  }

  private set(partial: Partial<PlayerSnap>) {
    this.snap = { ...this.snap, ...partial }
    this.emit()
  }

  getAnalyser() {
    return this.analyser
  }

  canResume() {
    return Boolean(this.buffer) && !this.snap.playing && this.snap.releaseId !== null
  }

  unlock() {
    const ctx = this.ensure()
    void ctx.resume()
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    try {
      source.start()
    } catch {
      /* already unlocking */
    }
  }

  private ensure() {
    if (!this.ctx) {
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.75
      const gain = ctx.createGain()
      gain.connect(analyser)
      analyser.connect(ctx.destination)
      this.ctx = ctx
      this.analyser = analyser
      this.gain = gain
    }
    return this.ctx
  }

  private stopGraph() {
    this.stopping = true
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
    const source = this.source
    this.source = null
    if (source) {
      source.onended = null
      try {
        source.stop()
      } catch {
        /* already stopped */
      }
      try {
        source.disconnect()
      } catch {
        /* already disconnected */
      }
    }
    this.stopping = false
  }

  private loop = () => {
    if (!this.snap.playing || !this.ctx) return
    const t = this.offset + (this.ctx.currentTime - this.startedAt)
    if (t >= this.snap.duration - 0.05) {
      this.advance()
      return
    }
    const now = performance.now()
    if (now - this.lastUi > 200) {
      this.lastUi = now
      this.set({ current: t })
    }
    this.raf = requestAnimationFrame(this.loop)
  }

  private playBuffer(buffer: AudioBuffer, offset: number) {
    const ctx = this.ensure()
    void ctx.resume()
    this.stopGraph()
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(this.gain!)
    this.buffer = buffer
    this.offset = offset
    this.startedAt = ctx.currentTime
    const dur = buffer.duration
    source.onended = () => {
      if (this.stopping || this.source !== source) return
      this.advance()
    }
    const startAt = Math.min(Math.max(0, offset), Math.max(0, dur - 0.05))
    source.start(0, startAt)
    this.source = source
    this.set({ duration: dur, current: startAt, playing: true, busy: false, error: null })
    this.raf = requestAnimationFrame(this.loop)
  }

  private pcmBuffer(pcm: Float32Array) {
    const ctx = this.ensure()
    const buffer = ctx.createBuffer(1, pcm.length, SAMPLE_RATE)
    buffer.getChannelData(0).set(pcm)
    return buffer
  }

  private async decode(blob: Blob) {
    const ctx = this.ensure()
    const raw = await blob.arrayBuffer()
    return ctx.decodeAudioData(raw.slice(0))
  }

  private face(item: WallItem, trackIndex: number, title: string) {
    return {
      releaseId: item.id,
      track: trackIndex,
      title,
      artist: item.artist,
      cover: item.cover,
      coverKey: item.coverKey,
      sleeve: item.sleeve,
      mark: item.mark,
    }
  }

  async play(item: WallItem, trackIndex: number, opts: PlayOpts) {
    this.unlock()
    this.item = item
    this.opts = opts
    const track = item.tracks[trackIndex]
    const title = track?.title ?? item.title
    if (item.takenDown) {
      this.set({ ...this.face(item, trackIndex, title), playing: false, busy: false, error: "Pulled. This one doesn't play." })
      return false
    }
    if (!track) {
      this.set({
        ...this.face(item, 0, item.title),
        playing: false,
        busy: false,
        error: "Open the tape to watch the video.",
      })
      return false
    }
    if (opts.offline && !opts.saved) {
      this.set({
        ...this.face(item, trackIndex, title),
        playing: false,
        busy: false,
        error: "Offline. Cop it to your phone first.",
      })
      return false
    }
    this.set({ ...this.face(item, trackIndex, title), busy: true, playing: false, error: null })
    try {
      let blob: Blob | undefined
      if (opts.saved) blob = await idbGet(`phone:${item.id}:${track.id}`)
      if (!blob && !opts.offline && track.audioKey) blob = await idbGet(track.audioKey)
      if (blob) {
        const buffer = await this.decode(blob)
        this.playBuffer(buffer, 0)
        return true
      }
      if (opts.offline) {
        this.set({ busy: false, playing: false, error: "That copy isn't on this phone. Cop it again." })
        return false
      }
      if (track.beat) {
        this.playBuffer(this.pcmBuffer(cachedBeat(track.beat)), 0)
        return true
      }
      this.set({ busy: false, playing: false, error: "No audio on that song." })
      return false
    } catch {
      this.set({ busy: false, playing: false, error: "Couldn't play that file." })
      return false
    }
  }

  private advance() {
    if (this.advancing) return
    this.advancing = true
    const item = this.item
    if (!item) {
      this.advancing = false
      return
    }
    const next = this.snap.track + 1
    this.stopGraph()
    if (next >= item.tracks.length) {
      this.offset = 0
      this.set({ playing: false, current: 0 })
      this.advancing = false
      return
    }
    void this.play(item, next, this.opts).finally(() => {
      this.advancing = false
    })
  }

  pause() {
    if (!this.snap.playing || !this.ctx) return
    this.offset = Math.min(this.snap.duration, this.offset + (this.ctx.currentTime - this.startedAt))
    this.stopGraph()
    this.set({ playing: false, current: this.offset })
  }

  resume() {
    if (!this.buffer || this.snap.playing) return
    this.unlock()
    this.playBuffer(this.buffer, this.offset)
  }

  toggle() {
    if (this.snap.playing) this.pause()
    else this.resume()
  }

  seek(ratio: number) {
    if (!this.buffer || !this.snap.duration) return
    const t = Math.max(0, Math.min(this.snap.duration - 0.05, ratio * this.snap.duration))
    this.offset = t
    if (this.snap.playing) this.playBuffer(this.buffer, t)
    else this.set({ current: t })
  }

  stopIf(id: string) {
    if (this.snap.releaseId !== id) return
    this.stopGraph()
    this.buffer = null
    this.item = null
    this.set({ ...emptySnap(), error: "Pulled." })
  }
}

let singleton: Player | null = null

export function getPlayer() {
  if (!singleton) singleton = new Player()
  return singleton
}

import { useEffect, useState } from "react"
import { idbGet } from "@/lib/lot/idb"

export function useBlobUrl(key?: string | null) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!key) {
      setUrl(null)
      return
    }
    let dead = false
    let current: string | null = null
    void idbGet(key).then((blob) => {
      if (dead || !blob) return
      current = URL.createObjectURL(blob)
      setUrl(current)
    })
    return () => {
      dead = true
      if (current) URL.revokeObjectURL(current)
    }
  }, [key])
  return url
}

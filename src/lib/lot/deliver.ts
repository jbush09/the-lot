export async function deliverFile(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type || "application/octet-stream" })
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename })
      return "shared" as const
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "aborted" as const
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 8000)
  return "downloaded" as const
}

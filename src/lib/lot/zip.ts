const CRC = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(data: Uint8Array) {
  let c = 0xffffffff
  for (let i = 0; i < data.length; i++) c = CRC[(c ^ data[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function u16(n: number) {
  return [n & 255, (n >>> 8) & 255]
}

function u32(n: number) {
  return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]
}

function copyBytes(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

export function zipStore(files: { name: string; data: Uint8Array }[]) {
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0
  for (const file of files) {
    const name = new TextEncoder().encode(file.name)
    const crc = crc32(file.data)
    const local = new Uint8Array(30 + name.length + file.data.length)
    local.set([0x50, 0x4b, 0x03, 0x04], 0)
    local.set(u16(20), 4)
    local.set(u16(0x800), 6)
    local.set(u16(0), 8)
    local.set(u16(0), 10)
    local.set(u16(0), 12)
    local.set(u32(crc), 14)
    local.set(u32(file.data.length), 18)
    local.set(u32(file.data.length), 22)
    local.set(u16(name.length), 26)
    local.set(u16(0), 28)
    local.set(name, 30)
    local.set(file.data, 30 + name.length)
    locals.push(local)

    const central = new Uint8Array(46 + name.length)
    central.set([0x50, 0x4b, 0x01, 0x02], 0)
    central.set(u16(20), 4)
    central.set(u16(20), 6)
    central.set(u16(0x800), 8)
    central.set(u16(0), 10)
    central.set(u16(0), 12)
    central.set(u16(0), 14)
    central.set(u32(crc), 16)
    central.set(u32(file.data.length), 20)
    central.set(u32(file.data.length), 24)
    central.set(u16(name.length), 28)
    central.set(u16(0), 30)
    central.set(u16(0), 32)
    central.set(u16(0), 34)
    central.set(u16(0), 36)
    central.set(u32(0), 38)
    central.set(u32(offset), 42)
    central.set(name, 46)
    centrals.push(central)
    offset += local.length
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0)
  const eocd = new Uint8Array(22)
  eocd.set([0x50, 0x4b, 0x05, 0x06], 0)
  eocd.set(u16(0), 4)
  eocd.set(u16(0), 6)
  eocd.set(u16(files.length), 8)
  eocd.set(u16(files.length), 10)
  eocd.set(u32(centralSize), 12)
  eocd.set(u32(offset), 16)
  eocd.set(u16(0), 20)
  return new Blob([...locals.map(copyBytes), ...centrals.map(copyBytes), copyBytes(eocd)], {
    type: "application/zip",
  })
}

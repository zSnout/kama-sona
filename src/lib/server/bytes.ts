export function bufferToString(source: BufferSource) {
  const buffer: Buffer =
    source instanceof ArrayBuffer || source instanceof Uint8Array
      ? Buffer.from(source)
      : Buffer.from(source.buffer)

  return buffer.toString("base64url")
}

export function stringToBuffer(source: string) {
  return Buffer.from(source, "base64url")
}

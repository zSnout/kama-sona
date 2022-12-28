import { error, ok, type Result } from "$lib/result"
import { AttachmentType, type Attachment } from "@prisma/client"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

const uploadDirectory = join(process.cwd(), ".uploads")

/** Sanitizes an identifier. */
function sanitize(id: string) {
  return id
    .replace(/[^\w-.:;]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Uploads a file to the internal `.uploads` folder. */
export async function upload(data: File): Promise<
  Result<{
    readonly id: string
    readonly attachment: Attachment
  }>
> {
  const id = `${sanitize(data.name)}-${crypto.randomUUID()}`

  try {
    await mkdir(uploadDirectory, { recursive: true })

    await writeFile(
      join(uploadDirectory, id),
      new DataView(await data.arrayBuffer())
    )
  } catch (e) {
    return error(String(e))
  }

  return ok({
    id,
    attachment: {
      creation: new Date(),
      type: AttachmentType.File,
      content: id,
      label: data.name,
    },
  })
}

/** Gets an uploaded file. */
export async function get(id: string): Promise<Result<Buffer>> {
  return readFile(join(uploadDirectory, sanitize(id)))
    .then<Result<Buffer>>(ok)
    .catch(error)
}

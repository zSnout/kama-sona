import { error, ok, type Result } from "$lib/result"
import { AttachmentType, type Attachment } from "@prisma/client"
import { query } from "./database"

/** Uploads a file to the internal `.uploads` folder. */
export async function upload(data: File): Promise<
  Result<{
    readonly id: string
    readonly attachment: Attachment
  }>
> {
  const upload = await query(async (database) =>
    database.upload.create({
      data: {
        blob: Buffer.from(await data.arrayBuffer()),
        name: data.name.slice(0, 200),
      },
    })
  )

  if (!upload.ok) {
    return upload
  }

  return ok({
    id: upload.value.id,
    attachment: {
      creation: new Date(),
      type: AttachmentType.File,
      content: upload.value.id,
      label: data.name.slice(0, 200),
    },
  })
}

/** Gets an uploaded file. */
export function get(id: string): Promise<Result<Buffer>> {
  return query<Buffer>(
    (database) =>
      database.upload
        .findUnique({
          where: { id },
        })
        .then((value) => value?.blob),
    error("No upload was found.")
  )
}

import {
  KS_MAIL_FROM,
  KS_MAIL_HOST,
  KS_MAIL_PASS,
  KS_MAIL_PORT,
  KS_MAIL_USER,
} from "$env/static/private"
import { createTransport } from "nodemailer"
import type Mail from "nodemailer/lib/mailer/index.js"
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import { error, ok, type Result } from "../result"

if (
  !KS_MAIL_FROM ||
  !KS_MAIL_HOST ||
  !KS_MAIL_PASS ||
  !KS_MAIL_PORT ||
  !KS_MAIL_USER
) {
  throw new TypeError(
    "Mail system credentials are missing; the mailer cannot be created."
  )
}

const config: SMTPTransport.Options = {
  host: KS_MAIL_HOST,
  port: +(KS_MAIL_PORT || 587),
  secure: KS_MAIL_PORT === "465",
  auth: {
    user: KS_MAIL_USER,
    pass: KS_MAIL_PASS,
  },
}

const transport = createTransport(config)

/** A {@link Result} to return whenever email issues occur. */
export const issues = error(
  "An issue occurred while connecting to the mail system."
)

/** Sends an email and returns a {@link Result} with the results. */
export async function send(
  options: Omit<Mail.Options, "from"> & {
    subject: unknown
    text: unknown
  } & ({ to: unknown } | { cc: unknown } | { bcc: unknown })
): Promise<Result<SMTPTransport.SentMessageInfo>> {
  try {
    const info = await transport.sendMail({ ...options, from: KS_MAIL_FROM })
    return ok(info)
  } catch {
    return issues
  }
}

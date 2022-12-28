import {
  KS_MAIL_FROM,
  KS_MAIL_HOST,
  KS_MAIL_LOG,
  KS_MAIL_PASS,
  KS_MAIL_PORT,
  KS_MAIL_USER,
} from "$env/static/private"
import { PUBLIC_KS_APP_NAME } from "$env/static/public"
import { createTransport } from "nodemailer"
import type Mail from "nodemailer/lib/mailer/index.js"
import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import { error, ok, type Result } from "../result"

const willLogEmails = KS_MAIL_LOG == "true"

if (willLogEmails) {
  console.log(
    `KS_MAIL_LOG is 'true', so ${PUBLIC_KS_APP_NAME} will log emails to the console instead of sending them.`
  )
} else if (
  !(
    KS_MAIL_FROM &&
    KS_MAIL_HOST &&
    KS_MAIL_PASS &&
    KS_MAIL_PORT &&
    KS_MAIL_USER
  )
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

const transport = willLogEmails ? undefined : createTransport(config)

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
): Promise<Result<void>> {
  if (transport) {
    try {
      await transport.sendMail({ ...options, from: KS_MAIL_FROM })
      return ok()
    } catch (err) {
      console.error(err)
      return issues
    }
  } else {
    console.log("An email was sent:")
    console.log(options)
    return ok()
  }
}

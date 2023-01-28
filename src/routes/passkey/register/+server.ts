import { error, ok, unwrapOr500 } from "$lib/result"
import { bufferToString, stringToBuffer } from "$lib/server/bytes"
import { expectedOrigin, Passkey, rpID, rpName } from "$lib/server/passkey"
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import type { RegistrationResponseJSON } from "@simplewebauthn/typescript-types"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ locals: { account } }) => {
  // 1. Get information about the current user.
  const { email, id, name, passkeys } = unwrapOr500(
    await account.select({
      email: true,
      id: true,
      name: true,
      passkeys: {
        select: {
          credentialId: true,
          transports: true,
        },
      },
    })
  )

  // 2. Create credential registration options.
  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: id,
    userName: email,
    userDisplayName: name,
    attestationType: "none",
    excludeCredentials: passkeys.map((authenticator) => ({
      id: stringToBuffer(authenticator.credentialId),
      type: "public-key",
      transports: authenticator.transports,
    })),
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "preferred",
    },
  })

  // 3. Update the user's current challenge.
  unwrapOr500(
    await account.update({
      currentChallenge: options.challenge,
    })
  )

  // 4. Return the options to the browser.
  return json(options)
}) satisfies RequestHandler

export const POST = (async ({ locals: { account }, request }) => {
  // 1. Get information about the current user.
  const { currentChallenge, email, id, name, passkeys } = unwrapOr500(
    await account.select({
      currentChallenge: true,
      email: true,
      id: true,
      name: true,
      passkeys: {
        select: {
          credentialId: true,
          transports: true,
        },
      },
    })
  )

  // 2. Reject the request if the user doesn't have a current challenge.
  if (!currentChallenge) {
    return json(
      error(
        "You don't have a verification challenge. Did you create a passkey on another device?"
      ),
      { status: 400 }
    )
  }

  // 3. Extract the request data.
  const data: RegistrationResponseJSON & { label?: unknown } =
    await request.json()

  // 4. Make sure we have a valid label.
  if (typeof data.label != "string" || !data.label) {
    return json(error("No label was passed for the passkey."), { status: 400 })
  }

  try {
    // 4. Verify the registration response.
    var verification = await verifyRegistrationResponse({
      response: data,
      expectedChallenge: currentChallenge,
      expectedOrigin: expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
    })
  } catch (err) {
    return json(error(err instanceof Error ? err.message : String(err)), {
      status: 500,
    })
  }

  // 5. Make sure we were verified.
  if (!verification.verified) {
    return json(error("You weren't verified to create a new passkey."), {
      status: 503,
    })
  }

  const { registrationInfo: info } = verification

  // 6. Make sure we have registration info.
  if (!info) {
    return json(
      error("The verification didn't have associated registration info."),
      { status: 500 }
    )
  }

  // 6. Store the credentials in the database.
  unwrapOr500(
    await Passkey.create({
      account: { connect: account.filter },
      counter: info.counter,
      credentialBackedUp: info.credentialBackedUp,
      credentialDeviceType: info.credentialDeviceType,
      credentialId: bufferToString(info.credentialID),
      credentialPublicKey: Buffer.from(info.credentialPublicKey),
      label: data.label,
    })
  )

  return json(ok())
}) satisfies RequestHandler

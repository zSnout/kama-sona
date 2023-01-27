import { error, ok, unwrapOr500 } from "$lib/result"
import { stringToBuffer } from "$lib/server/bytes"
import { expectedOrigin, Passkey, rpID } from "$lib/server/passkey"
import { PasskeyChallenge } from "$lib/server/passkey-challenge"
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import type { AuthenticationResponseJSON } from "@simplewebauthn/typescript-types"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET = (async ({ cookies }) => {
  const challengeId = cookies.get("challenge")

  if (challengeId) {
    // Errors are specifically NOT handled here.
    await new PasskeyChallenge({ id: challengeId }).delete()

    cookies.delete("challenge", {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      path: "/",
    })
  }

  // 2. Create credential authentication options.
  const options = generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  })

  // 3. Save the user's new challenge.
  const challenge = unwrapOr500(
    await PasskeyChallenge.create({
      challenge: options.challenge,
    })
  )

  // 4. Save the challenge ID in the user's cookies.
  cookies.set("challenge", unwrapOr500(await challenge.id()), {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  // 5. Return the options to the browser.
  return json(options)
}) satisfies RequestHandler

export const POST = (async ({ cookies, request }) => {
  // 1. Extract the request data.
  const data: AuthenticationResponseJSON = await request.json()

  // 2. Get the user's current challenge ID.
  const challengeId = cookies.get("challenge")

  // 2a. If they don't have a challenge ID, throw an error.
  if (!challengeId) {
    return json(
      error("You don't have a current challenge. Maybe you signed in already?"),
      { status: 400 }
    )
  }

  // 3. Get the user's current challenge.
  const { challenge } = unwrapOr500(
    await new PasskeyChallenge({ id: challengeId }).select({
      challenge: true,
    })
  )

  const passkeyObject = new Passkey({ credentialId: data.id })

  // 4. Get the passkey mentioned in the credentials, along with its account.
  const passkey = unwrapOr500(
    await passkeyObject.select({
      counter: true,
      credentialId: true,
      credentialPublicKey: true,
      transports: true,
    })
  )

  try {
    // 5. Verify the authentication response.
    var verification = await verifyAuthenticationResponse({
      response: data,
      expectedChallenge: challenge,
      expectedOrigin: expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
      authenticator: {
        counter: Number(passkey.counter),
        credentialID: stringToBuffer(passkey.credentialId),
        credentialPublicKey: passkey.credentialPublicKey,
        transports: passkey.transports,
      },
    })
  } catch (err) {
    return json(error(err instanceof Error ? err.message : String(err)), {
      status: 500,
    })
  }

  // 6. Make sure we were verified.
  if (!verification.verified) {
    return json(error("You weren't authenticated successfully."), {
      status: 400,
    })
  }

  const { authenticationInfo: info } = verification

  // 7. Make sure we have authentication info.
  if (!info) {
    return json(
      error("The verification didn't have associated authentication info."),
      { status: 500 }
    )
  }

  // 8. Store the new counter in the database.
  unwrapOr500(
    await passkeyObject.update({
      counter: info.newCounter,
    })
  )

  // 9. Delete the current challenge.
  unwrapOr500(
    await new PasskeyChallenge({
      id: challengeId,
    }).delete()
  )

  // 10. Actually sign them in.
  const account = unwrapOr500(await passkeyObject.account())
  const session = unwrapOr500(await account.session())
  const { code } = unwrapOr500(await session.select({ code: true }))

  cookies.set("session", code, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  return json(ok())
}) satisfies RequestHandler

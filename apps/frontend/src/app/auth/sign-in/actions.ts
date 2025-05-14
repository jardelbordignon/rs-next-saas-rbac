'use server'

import { z } from 'zod'
import { postSigninCredentials } from '@/http/post-signin-credentials'
import { HTTPError } from 'ky'

const credentialsSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email' }),
  password: z.string().min(6, { message: 'Please, provide your password' }),
})

export async function singInWithCredentials(_: unknown, formData: FormData) {
  const credentials = Object.fromEntries(formData)

  const { success, error, data } = credentialsSchema.safeParse(credentials)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    const { accessToken } = await postSigninCredentials(data)
    console.log({ accessToken })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
  }

  return { success: true, message: null, errors: null }
}

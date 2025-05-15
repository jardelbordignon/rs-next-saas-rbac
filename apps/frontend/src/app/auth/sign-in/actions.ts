'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { postSigninCredentials } from '@/http/post-signin-credentials'

const credentialsSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email' }),
  password: z.string().min(6, { message: 'Please, provide your password' }),
})

export async function singIn(_: unknown, formData: FormData) {
  const credentials = Object.fromEntries(formData)

  const { success, error, data } = credentialsSchema.safeParse(credentials)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    const { accessToken } = await postSigninCredentials(data)
    const { set } = await cookies()
    set('accessToken', accessToken, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
  }

  return { success: true, message: null, errors: null }
}

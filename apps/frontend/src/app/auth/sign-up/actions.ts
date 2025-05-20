'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'
import { postSignup } from '@/http/post-signup'

const signUpSchema = z
  .object({
    name: z.string().refine(v => v.split(' ').length > 1, {
      message: 'Please, enter your full name',
    }),
    email: z.string().email({ message: 'Please, provide a valid email' }),
    password: z.string().min(6, { message: 'Please, provide your password' }),
    password_confirmation: z.string(),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export async function signUp(formData: FormData) {
  const signUpData = Object.fromEntries(formData)

  const { success, error, data } = signUpSchema.safeParse(signUpData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  try {
    await postSignup(data)
    return { success: true, message: null, errors: null }
  } catch (error) {
    let message = 'Something went wrong in postSignup'
    if (error instanceof HTTPError) {
      message = (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}

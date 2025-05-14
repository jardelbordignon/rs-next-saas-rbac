'use server'

import { postSigninCredentials } from '@/http/post-signin-credentials'

export async function singInWithCredentials(prevState: any, data: FormData) {
  const { email, password } = Object.fromEntries(data)

  await new Promise(r => setTimeout(r, 2000))

  const result = await postSigninCredentials({
    email: email as string,
    password: password as string,
  })

  console.log(prevState)

  return result
}

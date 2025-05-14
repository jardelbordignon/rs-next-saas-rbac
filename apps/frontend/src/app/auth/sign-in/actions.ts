'use server'

import { postSigninCredentials } from '@/http/post-signin-credentials'

export async function singInWithCredentials(data: FormData) {
  const { email, password } = Object.fromEntries(data)

  const result = await postSigninCredentials({
    email: email as string,
    password: password as string,
  })

  console.log(result)
}

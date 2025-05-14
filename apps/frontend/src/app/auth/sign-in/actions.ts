'use server'

export async function singInWithCredentials(data: FormData) {
  console.log(Object.fromEntries(data))
}

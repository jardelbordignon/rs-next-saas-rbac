import { auth } from '@/auth/auth'
//import { Button } from '@/components/ui'

export default async function Home() {
  const { user } = await auth()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

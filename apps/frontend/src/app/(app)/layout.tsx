import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'

type Props = Readonly<{
  children: React.ReactNode
}>

export default async function AppLayout({ children }: Props) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return redirect('/auth/sign-in')
  }

  return <>{children}</>
}

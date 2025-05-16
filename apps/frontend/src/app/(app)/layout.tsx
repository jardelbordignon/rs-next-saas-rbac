import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'

type Props = Readonly<{
  children: React.ReactNode
  parallel: React.ReactNode
}>

export default async function AppLayout({ children, parallel }: Props) {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return redirect('/auth/sign-in')
  }

  return (
    <div className='mx-auto flex flex-col max-w-[1200px] w-full py-4 space-y-4'>
      <>
        {children}
        {parallel}
      </>
    </div>
  )
}

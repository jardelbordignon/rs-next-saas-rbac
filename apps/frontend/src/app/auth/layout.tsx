import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'

type Props = Readonly<{
  children: React.ReactNode
}>

export default async function AuthLayout({ children }: Props) {
  if (await isAuthenticated()) {
    return redirect('/')
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='w-full max-w-xs'>{children}</div>
    </div>
  )
}

import Link from 'next/link'
import { Button, Input, Label } from '@/components/ui'

export default function ForgotPasswordPage() {
  return (
    <form action='' className='space-y-4'>
      <div className='space-y-1'>
        <Label htmlFor='email'>E-mail</Label>
        <Input name='email' type='email' id='email' />
      </div>

      <Button type='submit' className='w-full'>
        Recovery password
      </Button>

      <Button variant='link' className='w-full' asChild>
        <Link href='/auth/sign-in'>Back to sign up</Link>
      </Button>
    </form>
  )
}

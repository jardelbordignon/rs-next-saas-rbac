import Link from 'next/link'
import { Button, Input, Label } from '@/components/ui'
import { EnterWithSocialAccount } from '../enter-with-social-account'

export default function SignUpPage() {
  return (
    <div>
      <form action='' className='space-y-4'>
        <div className='space-y-1'>
          <Label htmlFor='name'>Name</Label>
          <Input name='name' type='text' id='name' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='email'>E-mail</Label>
          <Input name='email' type='email' id='email' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='password'>Password</Label>
          <Input name='password' type='password' id='password' />
        </div>

        <div className='space-y-1'>
          <Label htmlFor='password_confirmation'>Password Confirmation</Label>
          <Input name='password_confirmation' type='password' id='password' />
        </div>

        <Button type='submit' className='w-full'>
          Create account
        </Button>

        <Button variant='link' className='w-full' asChild>
          <Link href='/auth/sign-in'>Already registered? Sign in</Link>
        </Button>
      </form>

      <EnterWithSocialAccount text='up' />
    </div>
  )
}

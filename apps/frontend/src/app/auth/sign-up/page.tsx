import Image from 'next/image'
import Link from 'next/link'
import { facebookIcon, githubIcon, googleIcon } from '@/assets'
import { Button, Input, Label, Separator } from '@/components/ui'

export default function SignUpPage() {
  return (
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

      {/* <Link
          href='/auth/sign-in'
          className='text-xs self-center font-medium text-foreground hover:underline'
        >
          I have an account
      </Link> */}

      <Separator />

      <Button variant='outline' className='w-full'>
        <Image src={facebookIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign up with Facebook
      </Button>
      <Button variant='outline' className='w-full'>
        <Image src={googleIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign up with Google
      </Button>
      <Button variant='outline' className='w-full'>
        <Image src={githubIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign up with Github
      </Button>
    </form>
  )
}

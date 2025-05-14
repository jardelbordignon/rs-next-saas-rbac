'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState } from 'react'
import { facebookIcon, githubIcon, googleIcon } from '@/assets'
import { Button, Input, Label, Separator } from '@/components/ui'
import { singInWithCredentials } from './actions'

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(singInWithCredentials, null)

  return (
    <form action={formAction} className='space-y-4'>
      <h2>{state?.accessToken}</h2>
      <div className='space-y-1'>
        <Label htmlFor='email'>E-mail</Label>
        <Input name='email' type='email' id='email' />
      </div>

      <div className='space-y-1'>
        <Label htmlFor='password'>Password</Label>
        <Input name='password' type='password' id='password' />

        <Link
          href='/auth/forgot-password'
          className='text-foreground text-xs font-medium hover:underline'
        >
          Forgot your password?
        </Link>
      </div>

      <Button type='submit' className='w-full'>
        {isPending ? <Loader2 className='size-4 animate-spin' /> : 'Sign in'}
      </Button>

      <Button variant='link' className='w-full' asChild>
        <Link href='/auth/sign-up'>Not registered? Sign up</Link>
      </Button>

      <Separator />

      <Button variant='outline' className='w-full'>
        <Image src={facebookIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign in with Facebook
      </Button>
      <Button variant='outline' className='w-full'>
        <Image src={googleIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign in with Google
      </Button>
      <Button variant='outline' className='w-full'>
        <Image src={githubIcon} alt='' className='mr-2 size-4 dark:invert' />
        Sign in with Github
      </Button>
    </form>
  )
}

'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
//import { startTransition, useActionState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Button, Input, Label } from '@/components/ui'
import { useFormState } from '@/hooks'
import { EnterWithSocialAccount } from '../enter-with-social-account'
import { singInWithCredentials } from './actions'

export function SignInForm() {
  // const initialState = { success: false, message: null, errors: null }

  // const [state, formAction, isPending] = useActionState(
  //   singInWithCredentials,
  //   initialState,
  // )

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   startTransition(() => {
  //     formAction(new FormData(event.currentTarget))
  //   })
  // }

  // const { success, message, errors } = state

  // useEffect(() => {
  //   if (!isPending && !success && message) {
  //     toast.error(message)
  //   }
  // }, [isPending, message, success])

  const [state, handleSubmit, isPending] = useFormState(singInWithCredentials, {
    onError: ({ message }) => toast.error(message),
    onSuccess: () => redirect('/'),
  })

  const { errors } = state

  return (
    <div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1'>
          <Label htmlFor='email'>E-mail</Label>
          <Input name='email' type='email' id='email' />

          {errors?.email && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className='space-y-1'>
          <Label htmlFor='password'>Password</Label>
          <Input name='password' type='password' id='password' />

          {errors?.password && (
            <p className='text-xs font-medium text-red-500 dark:text-red-400'>
              {errors.password[0]}
            </p>
          )}

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
      </form>

      <EnterWithSocialAccount text='in' />
    </div>
  )
}

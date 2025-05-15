'use client'

import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { TextInput } from '@/components/form'
import { Button } from '@/components/ui'
import { useFormState } from '@/hooks'
import { signUp } from './actions'

export function SignUpForm() {
  const [state, handleSubmit, isPending] = useFormState(signUp, {
    onError: ({ message }) => toast.error(message),
    onSuccess: () => redirect('/auth/sign-in'),
  })

  const { errors } = state

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <TextInput id='name' error={errors?.name?.[0]} />
      <TextInput id='email' label='E-mail' error={errors?.email?.[0]} />
      <TextInput id='password' type='password' error={errors?.password?.[0]} />
      <TextInput
        id='password_confirmation'
        label='Confirm password'
        type='password'
        error={errors?.password_confirmation?.[0]}
      />

      <Button type='submit' className='w-full'>
        {isPending ? <Loader2 className='size-4 animate-spin' /> : 'Sign up'}
      </Button>

      <Button variant='link' className='w-full' asChild>
        <Link href='/auth/sign-in'>Already registered? Sign in</Link>
      </Button>
    </form>
  )
}

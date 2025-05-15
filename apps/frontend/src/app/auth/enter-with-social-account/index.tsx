'use client'

import Image from 'next/image'
import { facebookIcon, githubIcon, googleIcon } from '@/assets'
import { Button, Separator } from '@/components/ui'
import { enterWithFacebook, enterWithGithub, enterWithGoogle } from './actions'

export function EnterWithSocialAccount({ text }: { text: 'in' | 'up' }) {
  return (
    <div className='space-y-4'>
      <Separator />
      <form action={enterWithFacebook}>
        <Button type='submit' variant='outline' className='w-full'>
          <Image src={facebookIcon} alt='' className='mr-2 size-4 dark:invert' />
          Sign {text} with Facebook
        </Button>
      </form>
      <form action={enterWithGoogle}>
        <Button type='submit' variant='outline' className='w-full'>
          <Image src={googleIcon} alt='' className='mr-2 size-4 dark:invert' />
          Sign {text} with Google
        </Button>
      </form>
      <form action={enterWithGithub}>
        <Button type='submit' variant='outline' className='w-full'>
          <Image src={githubIcon} alt='' className='mr-2 size-4 dark:invert' />
          Sign {text} with Github
        </Button>
      </form>
    </div>
  )
}

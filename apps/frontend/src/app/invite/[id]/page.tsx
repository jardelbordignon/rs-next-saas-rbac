import { CheckCircle, LogIn } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/auth/auth'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Separator,
} from '@/components/ui'
import { getInvite } from '@/http/get-invite'
import { getProfile } from '@/http/get-profile'
import { postInviteAccept } from '@/http/post-invite-accept'
import { relativeTime } from '@/lib/date'

interface InvitePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = await params

  const { invite } = await getInvite(id)
  const isUserAuthenticated = await isAuthenticated()

  let currentUserEmail = null
  if (isUserAuthenticated) {
    const { user } = await getProfile()
    currentUserEmail = user.email
  }

  const isUserAuthenticatedWithSameEmailFromInvite =
    isUserAuthenticated && invite.email === currentUserEmail

  async function signInFromInviteAction() {
    'use server'

    const { set } = await cookies()
    set('inviteId', id)
    redirect(`/auth/sign-in?email=${invite.email}`)
  }

  async function acceptInviteAction() {
    'use server'

    await postInviteAccept(id)
    redirect('/')
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='flex flex-col justify-center w-full max-w-sm space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <Avatar className='size-16'>
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>

          <p className='text-center text-balance leading-relaxed text-muted-foreground'>
            <span className='font-medium text-foreground'>
              {invite.author?.name ?? 'Someone'}
            </span>{' '}
            invited you to join{' '}
            <span className='font-medium text-foreground'>
              {invite.organization.name}
            </span>
            . <span className='text-xs'>{relativeTime(invite.createdAt)}</span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInviteAction}>
            <Button type='submit' variant='secondary' className='w-full'>
              <LogIn className='mr-2 size-4' />
              Sign in to accept the invite
            </Button>
          </form>
        )}

        {isUserAuthenticatedWithSameEmailFromInvite && (
          <form action={acceptInviteAction}>
            <Button type='submit' variant='secondary' className='w-full'>
              <CheckCircle className='mr-2 size-4' />
              Join {invite.organization.name}
            </Button>
          </form>
        )}

        {isUserAuthenticated && !isUserAuthenticatedWithSameEmailFromInvite && (
          <div className='space-y-4'>
            <p className='text-balance text-center text-sm lending-relaxed text-muted-foreground'>
              You are currently authenticated as{' '}
              <span className='font-medium text-foreground'>{currentUserEmail}</span>{' '}
              but this invite was sent to another e-mail.
            </p>

            <div className='space-y-2'>
              <Button className='w-full' variant='secondary' asChild>
                <a href='/api/auth/sign-out'>
                  <LogIn className='mr-2 size-4' />
                  Sign out from {currentUserEmail}
                </a>
              </Button>

              <Button className='w-full' variant='outline' asChild>
                <Link href='/'>Back to dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

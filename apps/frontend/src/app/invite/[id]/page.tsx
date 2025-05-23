import { Avatar, AvatarFallback, AvatarImage, Separator } from '@/components/ui'
import { getInvite } from '@/http/get-invite'
import { relativeTime } from '@/lib/date'

interface InvitePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { id } = await params

  const { invite } = await getInvite(id)

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
      </div>
    </div>
  )
}

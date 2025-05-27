'use client'

import { useQuery /*, useQueryClient*/ } from '@tanstack/react-query'
import { Check, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { getInvitesPending } from '@/http/get-invites-pending'
import { relativeTime } from '@/lib/date'
import { acceptInviteAction, rejectInviteAction } from './actions'

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)
  //const queryClient = useQueryClient()
  const queryKey = ['pending-invites']

  const { data, refetch } = useQuery({
    queryKey,
    queryFn: getInvitesPending,
    enabled: isOpen,
  })

  async function acceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)
    await refetch()
    //await queryClient.invalidateQueries({ queryKey })
  }

  async function rejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
    await refetch()
    //await queryClient.invalidateQueries({ queryKey })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost'>
          <UserPlus2 className='size-4' />
          <span className='sr-only'>Pending Invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-80 space-y-2'>
        <span className='block text-sm font-medium'>
          Pending Invites {data?.invites.length ? `(${data.invites.length})` : ''}
        </span>

        {data?.invites.length === 0 && (
          <p className='text-sm text-muted-foreground'>No pending invites.</p>
        )}

        {data?.invites.map(invite => (
          <div className='space-y-2' key={invite.id}>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              <span className='text-foreground'>{invite.author.name}</span> invited
              you to join{' '}
              <span className='text-foreground'>{invite.organization.name}</span>.{' '}
              <span className='text-xs'>{relativeTime(invite.createdAt)}</span>
            </p>

            <div className='flex gap-1'>
              <Button
                onClick={() => acceptInvite(invite.id)}
                size='xs'
                variant='outline'
              >
                <Check className='mr-1.5 size-3' />
                Accept
              </Button>

              <Button
                onClick={() => rejectInvite(invite.id)}
                size='xs'
                variant='ghost'
                className='text-muted-foreground'
              >
                <X className='mr-1.5 size-3' />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

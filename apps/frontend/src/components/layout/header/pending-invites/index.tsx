import { Check, UserPlus2, X } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { relativeTime } from '@/lib/date'

export function PendingInvites() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size='icon' variant='ghost'>
          <UserPlus2 className='size-4' />
          <span className='sr-only'>Pending Invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-80 space-y-2'>
        <span className='block text-sm font-medium'>Pending Invites (2)</span>
        <div className='space-y-2'>
          <p className='text-sm leading-relaxed text-muted-foreground'>
            <span className='text-foreground'>Jardel</span> invited you to join{' '}
            <span className='text-foreground'>Alfa</span>.{' '}
            <span className='text-xs'>{relativeTime(new Date())}</span>
          </p>

          <div className='flex gap-1'>
            <Button size='xs' variant='outline'>
              <Check className='mr-1.5 size-3' />
              Accept
            </Button>

            <Button size='xs' variant='ghost' className='text-muted-foreground'>
              <X className='mr-1.5 size-3' />
              Revoke
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

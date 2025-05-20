import { XOctagon } from 'lucide-react'
import { Button } from '@/components/ui'
import { revokeInviteAction } from './actions'

interface RevokeInviteButtonProps {
  inviteId: string
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button size='sm' variant='destructive'>
        <XOctagon className='size-4 mr-2' />
        Revoke invite
      </Button>
    </form>
  )
}

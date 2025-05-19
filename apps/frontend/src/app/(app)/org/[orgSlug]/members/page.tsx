import { ability } from '@/auth/auth'
import { InviteList } from './invite-list'
import { MemberList } from './member-list'

export default async function OrganizationMembersPage() {
  const permissions = await ability()

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-bold'>Organization Members</h1>

      <div className='space-y-4'>
        {permissions?.can('get', 'Invite') && <InviteList />}
        {permissions?.can('get', 'User') && <MemberList />}
      </div>
    </div>
  )
}

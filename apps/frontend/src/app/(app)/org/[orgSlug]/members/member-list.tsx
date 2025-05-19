import { organizationSchema } from '@repo/authorizations'
import { ArrowLeftRight, Crown } from 'lucide-react'
import Image from 'next/image'
import { ability, getCurrentOrgCookie } from '@/auth/auth'
import {
  Avatar,
  AvatarFallback,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui'
import { getOrganization } from '@/http/get-organization'
import { getOrganizationMembers } from '@/http/get-organization-members'
import { getOrganizationMembership } from '@/http/get-organization-membership'

export async function MemberList() {
  const orgCookie = await getCurrentOrgCookie()
  if (!orgCookie) return null
  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getOrganizationMembership(orgCookie),
    getOrganizationMembers(orgCookie),
    getOrganization(orgCookie),
  ])

  const parsedOrganization = organizationSchema.parse(organization)

  return (
    <div className='space-y-2'>
      <h2 className='text-2xl font-bold'>Members</h2>

      <div className='rounded border'>
        <Table>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id} style={{ width: 48 }}>
                <TableCell className='py-2.5'>
                  <Avatar>
                    <AvatarFallback />
                    {member.avatarUrl && (
                      <Image
                        src={member.avatarUrl}
                        alt=''
                        width={32}
                        height={32}
                        className='aspect-square size-full'
                      />
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className='py-2.5'>
                  <div className='flex flex-col'>
                    <span className='font-medium inline-flex items-center gap-2'>
                      {member.name}
                      {member.userId === membership.userId && ' (me)'}
                      {member.userId === organization.ownerId && (
                        <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
                          <Crown className='size-3' />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='py-2.5'>
                  <div className='flex items-center justify-end gap-2'>
                    {permissions?.can('transfer_ownership', parsedOrganization) && (
                      <Button size='sm' variant='ghost'>
                        <ArrowLeftRight className='mr-2 size-4' />
                        Transfer organization
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

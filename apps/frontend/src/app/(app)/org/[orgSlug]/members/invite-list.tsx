import { ability, getCurrentOrgCookie } from '@/auth/auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui'
import { getOrganizationInvites } from '@/http/get-organization-invites'
import { CreateInviteForm } from './create-invite-form'
import { RevokeInviteButton } from './revoke-invite-button'

export async function InviteList() {
  const orgCookie = await getCurrentOrgCookie()
  if (!orgCookie) return null
  const { invites } = await getOrganizationInvites(orgCookie)

  const permissions = await ability()

  return (
    <div className='space-y-2'>
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

      {invites.length > 0 && (
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold'>Invites</h2>

          <div className='rounded border'>
            <div className='rounded border'>
              <Table>
                <TableBody>
                  {invites.map(invite => (
                    <TableRow key={invite.id} style={{ width: 48 }}>
                      <TableCell className='py-2.5 text-muted-foreground'>
                        {invite.email}
                      </TableCell>
                      <TableCell className='py-2.5 font-medium'>
                        {invite.role}
                      </TableCell>
                      <TableCell className='py-2.5'>
                        <div className='flex justify-end'>
                          {permissions?.can('delete', 'Invite') && (
                            <RevokeInviteButton inviteId={invite.id} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

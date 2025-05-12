import { and, database, eq } from '@/database'
import { invites } from '@/database/schema'
import { NotFoundError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'
import type { Membership } from 'fastify'

export async function revokeInviteService(
  { membership, organization, userId }: Membership,
  inviteId: string,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('delete', 'Invite')) {
    throw new UnauthorizedError('You are not allowed to delete an invite')
  }

  const [invite] = await database
    .select()
    .from(invites)
    .where(and(eq(invites.id, inviteId), eq(invites.organizationId, organization.id)))

  if (!invite) {
    throw new NotFoundError('Invite not found')
  }

  await database.delete(invites).where(eq(invites.id, inviteId))
}

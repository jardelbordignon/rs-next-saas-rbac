import { database, desc, eq } from '@/database'
import { invites, users } from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'
import type { Membership } from 'fastify'

export async function findManyInviteService({
  membership,
  organization,
  userId,
}: Membership) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('create', 'Invite')) {
    throw new UnauthorizedError('You are not allowed to see organization invites')
  }

  const invitesData = await database
    .select({
      id: invites.id,
      email: invites.email,
      role: invites.role,
      createdAt: invites.createdAt,
      author: {
        id: users.id,
        name: users.name,
      },
    })
    .from(invites)
    .where(eq(invites.organizationId, organization.id))
    .innerJoin(users, eq(users.id, invites.authorId))
    .orderBy(desc(invites.createdAt))
    .execute()

  return { invites: invitesData }
}

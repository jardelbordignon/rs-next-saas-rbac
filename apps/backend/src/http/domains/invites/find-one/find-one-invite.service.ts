import { database, eq } from '@/database'
import { invites, organizations, users } from '@/database/schema'
import { BadRequestError } from '@/http/errors'

export async function findOneInviteService(inviteId: string) {
  const [invite] = await database
    .select({
      id: invites.id,
      email: invites.email,
      role: invites.role,
      createdAt: invites.createdAt,
      author: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
      organization: {
        id: organizations.id,
        name: organizations.name,
        avatarUrl: organizations.avatarUrl,
      },
    })
    .from(invites)
    .where(eq(invites.id, inviteId))
    .innerJoin(users, eq(users.id, invites.authorId))
    .innerJoin(organizations, eq(organizations.id, invites.organizationId))
    .limit(1)
    .execute()

  if (!invite) {
    throw new BadRequestError('Invite not found')
  }

  return { invite }
}

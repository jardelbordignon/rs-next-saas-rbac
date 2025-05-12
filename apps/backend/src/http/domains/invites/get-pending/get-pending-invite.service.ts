import { database, eq } from '@/database'
import { invites, organizations, users } from '@/database/schema'
import { BadRequestError } from '@/http/errors'

export async function getPendingInviteService(userId: string) {
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new BadRequestError('User not found')
  }

  const pendingInvites = await database
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
    .where(eq(invites.email, user.email))
    .innerJoin(users, eq(users.id, invites.authorId))
    .innerJoin(organizations, eq(organizations.id, invites.organizationId))

  return { invites: pendingInvites }
}

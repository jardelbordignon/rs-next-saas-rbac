import { database, eq } from '@/database'
import { invites, members, users } from '@/database/schema'
import { BadRequestError, UnauthorizedError } from '@/http/errors'

type Data = {
  userId: string
  inviteId: string
}

export async function acceptInviteService({ userId, inviteId }: Data) {
  const [invite] = await database
    .select()
    .from(invites)
    .where(eq(invites.id, inviteId))
    .limit(1)

  if (!invite) {
    throw new BadRequestError('Invite not found or expired')
  }

  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new BadRequestError('User not found')
  }

  const { email, organizationId, role } = invite

  if (email !== user.email) {
    throw new UnauthorizedError('You are not allowed to accept this invite')
  }

  await database.transaction(async tx => {
    await tx.insert(members).values({ userId, organizationId, role })
    await tx.delete(invites).where(eq(invites.id, inviteId))
  })
}

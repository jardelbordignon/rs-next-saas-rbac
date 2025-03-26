import { eq } from 'drizzle-orm'
import { database } from '@/database'
import { users } from '@/database/schema'
import { NotFoundError } from '@/http/errors'

export async function getProfileService(userId: string) {
  const [user] = await database
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return { user }
}

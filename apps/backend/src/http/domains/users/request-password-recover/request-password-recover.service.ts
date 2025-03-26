import { eq } from 'drizzle-orm'
import { database } from '@/database'
import { tokens, users } from '@/database/schema'

export async function requestPasswordRecoverService(email: string) {
  const [userFromEmail] = await database
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  // We don't want people to know if the user really exists or not
  if (!userFromEmail) return

  const [token] = await database
    .insert(tokens)
    .values({
      type: 'PASSWORD_RECOVER',
      userId: userFromEmail.id,
    })
    .returning({ code: tokens.id })

  // TODO: Send email with the token
  console.log('Recovery password token:', token.code)
}

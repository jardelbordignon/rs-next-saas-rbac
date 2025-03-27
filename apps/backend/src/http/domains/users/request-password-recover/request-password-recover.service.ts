import { database, eq } from '@/database'
import { tokens, users } from '@/database/schema'

export async function requestPasswordRecoverService(email: string) {
  const [userByEmail] = await database
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
  if (!userByEmail) return

  const [token] = await database
    .insert(tokens)
    .values({
      type: 'PASSWORD_RECOVER',
      userId: userByEmail.id,
    })
    .returning({ code: tokens.id })

  // TODO: Send email with the token
  console.log('Recovery password token:', token.code)
}

import { and, eq } from 'drizzle-orm'
import { database } from '@/database'
import { type AccountProvider, accounts, users } from '@/database/schema'
import { BadRequestError } from '@/http/errors'
import type { FastifyInstance } from 'fastify'

type Props = {
  avatarUrl: string
  email: string | null
  name: string | null
  provider: {
    id: string
    type: AccountProvider
  }
}

export async function authSocialHandler(
  jwt: FastifyInstance['jwt'],
  { avatarUrl, email, name, provider }: Props,
) {
  if (!email) {
    throw new BadRequestError(
      `Your ${provider.type} account must have an email to authenticate`,
    )
  }

  return await database.transaction(async tx => {
    const [userFromEmail] = await tx
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    let user = userFromEmail

    if (!user) {
      const [newUser] = await tx
        .insert(users)
        .values({ avatarUrl, email, name })
        .returning()

      user = newUser
    }
    //console.log('user', user)

    const [socialAccount] = await tx
      .select()
      .from(accounts)
      .where(and(eq(accounts.provider, provider.type), eq(accounts.userId, user.id)))
      .limit(1)

    if (!socialAccount) {
      await tx.insert(accounts).values({
        provider: provider.type,
        providerAccountId: provider.id,
        userId: user.id,
      })
    }
    //console.log('socialAccount', socialAccount)

    const accessToken = jwt.sign({ sub: user.id })

    return { accessToken }
  })
}

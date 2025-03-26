import { eq } from 'drizzle-orm'
import { database } from '@/database'
import { users } from '@/database/schema'
import { BadRequestError, UnauthorizedError } from '@/http/errors'
import type { FastifyInstance } from 'fastify'

type Credentials = {
  email: string
  password: string
}

export async function authByCredentialsService(
  jwt: FastifyInstance['jwt'],
  { email, password }: Credentials,
) {
  const [userByEmail] = await database
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!userByEmail) {
    throw new UnauthorizedError('Invalid credentials')
  }

  if (!userByEmail.passwordHash) {
    throw new BadRequestError('User does not have a password, use social login')
  }

  const passwordMatch = await Bun.password.verify(password, userByEmail.passwordHash)

  if (!passwordMatch) {
    throw new UnauthorizedError('Invalid credentials')
  }

  return {
    accessToken: jwt.sign({ sub: userByEmail.id }),
  }
}

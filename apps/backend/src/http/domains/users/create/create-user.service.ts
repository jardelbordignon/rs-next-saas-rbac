import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { database } from '@/database'
import { type InsertUser, users } from '@/database/schema'
import { ConflictError } from '@/http/errors'

export type CreateUserServiceDto = Omit<InsertUser, 'id' | 'passwordHash'> & {
  password: string
  avatar_url?: string
}

export async function createUserService({
  email,
  name,
  avatar_url,
  password,
}: CreateUserServiceDto) {
  const [userWithSameEmail] = await database
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (userWithSameEmail) {
    throw new ConflictError(`User with email ${email} already exists`)
  }

  const passwordHash = await hash(password, 7)

  const user = await database.insert(users).values({
    name,
    email,
    passwordHash,
    avatarUrl: avatar_url,
  })

  return user
}

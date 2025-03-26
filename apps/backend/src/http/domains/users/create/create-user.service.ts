import { and, eq, or } from 'drizzle-orm'
import { database } from '@/database'
import { type InsertUser, members, organizations, users } from '@/database/schema'
import { ConflictError } from '@/http/errors'

export type CreateUserServiceDto = Omit<InsertUser, 'id' | 'passwordHash'> & {
  password: string
  avatarUrl?: string
}

export async function createUserService({
  email,
  name,
  avatarUrl,
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

  return database.transaction(async tx => {
    const [user] = await tx
      .insert(users)
      .values({
        name,
        email,
        passwordHash: await Bun.password.hash(password),
        avatarUrl,
      })
      .returning()

    const domain = email.split('@')[1]

    const [autoJoinOrganization] = await tx
      .select({ id: organizations.id })
      .from(organizations)
      .where(
        and(
          or(
            eq(organizations.domain, domain),
            eq(organizations.domain, `http://${domain}`),
            eq(organizations.domain, `https://${domain}`),
          ),
          eq(organizations.shouldAttachUsersByDomain, true),
        ),
      )
      .limit(1)

    if (autoJoinOrganization) {
      await tx.insert(members).values({
        organizationId: autoJoinOrganization.id,
        userId: user.id,
      })
    }

    return user
  })
}

import { database, eq } from '@/database'
import { tokens, users } from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'

type RequestPasswordResetServiceParams = {
  code: string
  password: string
}

export async function requestPasswordResetService({
  code,
  password,
}: RequestPasswordResetServiceParams) {
  const [tokenFromCode] = await database
    .select()
    .from(tokens)
    .where(eq(tokens.id, code))
    .limit(1)

  if (!tokenFromCode) {
    throw new UnauthorizedError('Invalid token')
  }

  const passwordHash = await Bun.password.hash(password)

  return await database.transaction(async tx => {
    await tx
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, tokenFromCode.userId))

    await tx.delete(tokens).where(eq(tokens.id, code))
  })
}

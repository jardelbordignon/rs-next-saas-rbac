import { defineAbilityFor, userSchema } from '@repo/authorizations'
import type { Role } from '@repo/authorizations/src/roles'

export function getUserPermissions(userId: string, role: Role) {
  const userPermissions = userSchema.parse({ id: userId, role })

  return defineAbilityFor(userPermissions)
}

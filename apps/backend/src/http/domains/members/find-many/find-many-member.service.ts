import { database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  members,
  users,
} from '@/database/schema'
import { NotFoundError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export async function findManyMemberService({
  membership,
  organization,
  userId,
}: Membership) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('get', 'User')) {
    throw new UnauthorizedError('You are not allowed to see organization members')
  }

  const organizationMembers = await database
    .select({
      id: members.id,
      role: members.role,
      userId: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(members)
    .innerJoin(users, eq(members.userId, users.id))
    .where(eq(members.organizationId, organization.id))
    .orderBy(members.role)

  if (!organizationMembers.length) {
    throw new NotFoundError('There are no members in this organization')
  }

  return { members: organizationMembers }
}

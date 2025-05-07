import { and, database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  members,
} from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

type Props = {
  userMembership: Membership
  memberId: string
}

export async function deleteMemberService({ userMembership, memberId }: Props) {
  const { organization, membership, userId } = userMembership
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('delete', 'User')) {
    throw new UnauthorizedError('You are not allowed to delete organization members')
  }

  await database
    .delete(members)
    .where(and(eq(members.id, memberId), eq(members.organizationId, organization.id)))

  return
}

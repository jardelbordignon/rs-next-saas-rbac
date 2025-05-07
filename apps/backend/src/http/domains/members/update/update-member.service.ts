import { and, database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  type UpdateMember,
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
  data: UpdateMember
}

export async function updateMemberService({ userMembership, memberId, data }: Props) {
  const { organization, membership, userId } = userMembership
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('update', 'User')) {
    throw new UnauthorizedError('You are not allowed to update organization members')
  }

  await database
    .update(members)
    .set(data)
    .where(and(eq(members.id, memberId), eq(members.organizationId, organization.id)))

  return
}

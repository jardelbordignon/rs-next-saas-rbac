import { organizationSchema } from '@repo/authorizations'
import { database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  organizations,
} from '@/database/schema'
import { UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  organization: SelectOrganization
  membership: SelectMember
}

type Props = {
  userId: string
  membership: Membership
}

export async function deleteOrganizationService({
  userId,
  membership: { organization, membership },
}: Props) {
  const authOrganization = organizationSchema.parse({
    id: organization.id,
    ownerId: organization.ownerId,
  })

  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('delete', authOrganization)) {
    throw new UnauthorizedError('You are not allowed to delete this organization')
  }

  await database.delete(organizations).where(eq(organizations.id, organization.id))
}

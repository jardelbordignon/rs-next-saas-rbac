import { organizationSchema } from '@repo/authorizations'
import { and, database, eq, ne } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  organizations,
} from '@/database/schema'
import { ConflictError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  organization: SelectOrganization
  membership: SelectMember
}

type UpdateOrganizationServiceDto = {
  name: string
  domain?: string
  shouldAttachUsersByDomain?: boolean
}

type Props = {
  userId: string
  membership: Membership
  data: UpdateOrganizationServiceDto
}

export async function updateOrganizationService({
  userId,
  membership: { organization, membership },
  data: { name, domain, shouldAttachUsersByDomain },
}: Props) {
  const authOrganization = organizationSchema.parse({
    id: organization.id,
    ownerId: organization.ownerId,
  })

  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('update', authOrganization)) {
    throw new UnauthorizedError('You are not allowed to update this organization')
  }

  if (domain) {
    const [organizationByDomain] = await database
      .select({ id: organizations.id })
      .from(organizations)
      .where(
        and(eq(organizations.domain, domain), ne(organizations.id, organization.id)),
      )
      .limit(1)

    if (organizationByDomain) {
      throw new ConflictError('An organization already exists with this domain')
    }
  }

  await database
    .update(organizations)
    .set({ name, domain, shouldAttachUsersByDomain })
    .where(eq(organizations.id, organization.id))
}

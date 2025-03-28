import { organizationSchema } from '@repo/authorizations'
import { and, database, eq } from '@/database'
import {
  type SelectMember,
  type SelectOrganization,
  members,
  organizations,
} from '@/database/schema'
import { BadRequestError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  organization: SelectOrganization
  membership: SelectMember
}

type ChangeOrganizationOwnerServiceDto = {
  newOwnerId: string
}

type Props = {
  userId: string
  membership: Membership
  data: ChangeOrganizationOwnerServiceDto
}

export async function changeOrganizationOwnerService({
  userId,
  membership: { organization, membership },
  data: { newOwnerId },
}: Props) {
  const authOrganization = organizationSchema.parse({
    id: organization.id,
    ownerId: organization.ownerId,
  })

  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('transfer_ownership', authOrganization)) {
    throw new UnauthorizedError(
      'You are not allowed to transfer ownership of this organization',
    )
  }

  const [newOwnerIsMemberOfOrganization] = await database
    .select({ id: members.id })
    .from(members)
    .where(
      and(
        eq(members.userId, newOwnerId),
        eq(members.organizationId, organization.id),
      ),
    )
    .limit(1)

  if (!newOwnerIsMemberOfOrganization) {
    throw new BadRequestError('The new owner must be a member of the organization')
  }

  await database.transaction(async tx => {
    await tx
      .update(members)
      .set({ role: 'ADMIN' })
      .where(
        and(
          eq(members.userId, newOwnerId),
          eq(members.organizationId, organization.id),
        ),
      )

    await tx
      .update(organizations)
      .set({ ownerId: newOwnerId })
      .where(eq(organizations.id, organization.id))
  })
}

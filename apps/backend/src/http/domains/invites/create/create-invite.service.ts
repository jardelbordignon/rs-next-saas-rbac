import { and, database, eq } from '@/database'
import {
  type InsertInvite,
  type SelectMember,
  type SelectOrganization,
  invites,
  members,
  users,
} from '@/database/schema'
import { BadRequestError, ConflictError, UnauthorizedError } from '@/http/errors'
import { getUserPermissions } from '@/utils'

type Membership = {
  userId: string
  organization: SelectOrganization
  membership: SelectMember
}

export type CreateInviteData = Pick<InsertInvite, 'email' | 'role'>

export async function createInviteService(
  { membership, organization, userId }: Membership,
  { email, role }: CreateInviteData,
) {
  const { cannot } = getUserPermissions(userId, membership.role)

  if (cannot('create', 'Invite')) {
    throw new UnauthorizedError('You are not allowed to create new invites')
  }

  const domain = email.split('@')[1]

  if (organization.shouldAttachUsersByDomain && organization.domain === domain) {
    throw new BadRequestError(
      `Users with "${domain}" email domain will join your organization automatically on login`,
    )
  }

  const [inviteWithSameEmail] = await database
    .select()
    .from(invites)
    .where(and(eq(invites.email, email), eq(invites.organizationId, organization.id)))
    .execute()

  if (inviteWithSameEmail) {
    throw new ConflictError(
      `User with email "${email}" already has an invite for this organization`,
    )
  }

  const [memberWithSameEmail] = await database
    .select()
    .from(members)
    .where(eq(members.organizationId, organization.id))
    .innerJoin(users, eq(users.email, email))
    .execute()

  if (memberWithSameEmail) {
    throw new ConflictError(
      `User with email "${email}" already belongs to this organization`,
    )
  }

  const [invite] = await database
    .insert(invites)
    .values({
      email,
      role,
      authorId: userId,
      organizationId: organization.id,
    })
    .returning()

  return { inviteId: invite.id }
}

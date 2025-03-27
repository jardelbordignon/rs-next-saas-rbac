import { database, eq } from '@/database'
import { members, organizations } from '@/database/schema'

export async function findManyOrganizationService(userId: string) {
  const organizationsWhereUserIsMemberWithRole = await database
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
      avatarUrl: organizations.avatarUrl,
      role: members.role,
    })
    .from(organizations)
    .innerJoin(members, eq(members.organizationId, organizations.id))
    .where(eq(members.userId, userId))
    .orderBy(organizations.name)

  if (!organizationsWhereUserIsMemberWithRole.length) {
    return { organizations: [] }
  }

  return {
    organizations: organizationsWhereUserIsMemberWithRole,
  }
}
